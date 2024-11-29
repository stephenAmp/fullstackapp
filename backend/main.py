from fastapi import FastAPI,HTTPException,Depends,status;
from pydantic import BaseModel;
from typing import Annotated;
from database import engine,sessionLocal;
from sqlalchemy.orm import Session;
from fastapi.middleware.cors import CORSMiddleware
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


#db dependency
def get_db():
    db  = sessionLocal()
    try:
        yield db
    finally:
        db.close()

#db injection (annotation)
db_dependency = Annotated[Session,Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

#endpoints
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

