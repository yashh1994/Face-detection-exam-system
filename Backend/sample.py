from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from DB.orm_model import Base, Test, User
from routes import encrypt_decrypt

load_dotenv()

PG_DB_URL = os.getenv("PG_DATABASE_URL")


engine = create_engine(PG_DB_URL)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

session = Session()


# try:
# except Exception as e:
#     print("Error is : ",e)
print("Open link: ",encrypt_decrypt(data="6",action="encode"))
#! For the Insert the User
# try:
#     user1 = User(name="Yash",email="yash@gmail.com",password="12345")
#     session.add(user1)
#     session.commit()
#     print("Inserted Sucessfully!: ",user1.id)
# except Exception as e:
#     print(e)

#! For Delete the User
# user_to_delete = session.query(User).filter_by(email="yash@gmail.com").first()
# if user_to_delete:
#     session.delete(user_to_delete)
#     session.commit()
# session.close()
# print("Deleted Sucessfully!")

#! Empty the table
# all_user = session.query(User).all()
# for u in all_user:
#     session.delete(u)
#     print(f"Deleted User: {u}")
# session.commit()
# session.close()


# ! Print all the User
# users = session.query(User).all()
# for u in users:
#     print(u)
# session.close()

# ! Search for a User by email
# search_email = "yash@gmail.com"
# user = session.query(User).filter_by(email=search_email).first()
# if user:
#     print(f"User found: {user}")
# else:
#     print("User not found")
# session.close()




# #! For the Insert the Test
# t1 = Test("FM chapter 1",15,"This is very important test","15/15/2005","15/14/2005","1",[{
#     "question":"What is the Full form of FM",
#     "options":["Fuck u","None of them","Fundament bla","fadadu"],
#     "answer":[3],
#     "isMulti":False
# }])
# session.add(t1)
# session.commit()
# session.close()
# print("Inserted Sucessfully!")


