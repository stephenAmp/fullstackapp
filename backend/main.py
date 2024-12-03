from fastapi import FastAPI,HTTPException,Depends,status;
from pydantic import BaseModel;
from typing import Annotated;
from database import engine,sessionLocal;
from sqlalchemy.orm import Session;
from fastapi.middleware.cors import CORSMiddleware;
from auth.auth_bearer import JWTBearer
from auth.auth_handler import get_hashed_password,verify_password,create_access_token,decode_token;
import models;

#instantiate fastAPI
app = FastAPI()

#handle CORS to allow api access
origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods =['*'],
    allow_headers= ['*']
)

#pydantic for post requests
class PostBase(BaseModel):
    activity:str

class PostModel(PostBase):
    id:int

    class config:
        orm_mode = True

#pydantic for user

class UserBase(BaseModel):
    username:str
    password:str

# class UserInDB(UserBase):
#     hashed_password:str   

#db dependency
def get_db():
    db  = sessionLocal()
    try:
        yield db
    finally:
        db.close()

#db injection (annotation)
db_dependency = Annotated[Session,Depends(get_db)]

#create DB tables
models.Base.metadata.create_all(bind=engine)

#endpoints(main app functionalities)
#CREATE
@app.post('/activities/',response_model=PostModel, status_code=status.HTTP_201_CREATED)
async def create_activity(post:PostBase, db:db_dependency):
    db_post = models.Posts(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
#READ
@app.get('/activities/',status_code=status.HTTP_200_OK)
async def read_activities(db:db_dependency):
    db_posts = db.query(models.Posts).all()
    if not db_posts:
        raise HTTPException(status_code=404,detail = 'No listed activities')
    return db_posts
#DELETE
@app.delete('/activities/{post_id}',status_code=status.HTTP_200_OK)
async def delete_activity(post_id:int,db:db_dependency):
    db_post = db.query(models.Posts).filter(models.Posts.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail='Activity cannot be found')
    db.delete(db_post)
    db.commit()
    return {'Activity deleted successfully'}
#UPDATE
@app.put('/activities/{post_id}',status_code=status.HTTP_200_OK)
async def update_activity(post_id:int,updated_post:PostBase,db:db_dependency):
    db_post = db.query(models.Posts).filter(models.Posts.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail = 'Activity cannot be found')
    #Update fields
    for key,value in updated_post.model_dump().items():
        setattr(db_post,key,value)
    db.commit()
    db.refresh(db_post)
    return db_post


#endpoints(authentication)
@app.post('/register/')
def register(user:UserBase,db:db_dependency):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already exists')
    #hash password in db and create new user
    hashed_password = get_hashed_password(user.password)
    new_user = models.User(username = user.username, password = hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {'msg':'User successfully registered'}


@app.post('/login/')
def login(user:UserBase,db:db_dependency):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid username or password")
    if not verify_password(user.password,db_user.password):
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail='Invalid username or password')
    access_token = create_access_token(data = {'sub':user.username})
    return {'access_token':access_token,'token_type':'bearer'}

@app.get('/activities/',dependencies=[Depends(JWTBearer())])
def get_protected_route(token:str = Depends(decode_token)):
    return {'msg':'Login successful','token':token}

