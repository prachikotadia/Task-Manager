from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import httpx
from datetime import datetime, timedelta
from jose import JWTError, jwt

# --- CORS Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- JWT Configuration ---
SECRET_KEY = "prachi-super-secret-key"  # In production, move this to an environment variable!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token valid for 60 minutes

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- Dummy User (for now) ---
fake_user = {
    "username": "prachi",
    "password": "admin123",  # Later you can hash this password properly
}

# --- Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str

# --- Create Access Token ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Get Current User ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return User(username=username)

# --- Routes ---

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != fake_user["username"] or form_data.password != fake_user["password"]:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": fake_user["username"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/user-with-tasks")
async def user_with_tasks():
    user_info = {"name": "Prachi", "role": "admin"}
    async with httpx.AsyncClient() as client:
        response = await client.get("https://task-service-mf2x.onrender.com/tasks")
        tasks = response.json()
    return {"user": user_info, "tasks": tasks}

@app.get("/")
def root():
    return {"message": "User Service Running with JWT!"}
