from datetime import datetime,timezone, timedelta;
from jose import JWTError, jwt;
from passlib.context import CryptContext;
from fastapi import HTTPException, status


SECRET_KEY = 'my-secret-code'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES= 30

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def verify_password(plain_password,hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def get_hashed_password(password):
    return pwd_context.hash(password,scheme='bcrypt')

def create_access_token(data:dict,expires_delta:timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({'exp':expire})
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def decode_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload.get('sub')
    except JWTError:
        HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
