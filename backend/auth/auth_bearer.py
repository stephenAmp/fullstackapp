from fastapi import Request,HTTPException,status;
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials;

#Class used in fastapi by server to verify and validate token  
class JWTBearer(HTTPBearer):
    def __init__(self,auto_error:bool=True):
        super(JWTBearer,self).__init__(auto_error=auto_error)

    async def __call__(self,request:Request):
        credentials: HTTPAuthorizationCredentials  = await super().__call__(request)

        #implement bearer scheme if credentials exists
        if credentials:
            if not credentials.scheme == 'Bearer':
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Invalid auth scheme')
            #return token
            return credentials.credentials
        
        #no credentials
        raise HTTPException(status_code=status.HTTP_403_UNAUTHORIZED, detail='Invalid auth token')

    

