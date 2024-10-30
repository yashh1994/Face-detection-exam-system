from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from DB.orm_model import Base,User

load_dotenv()

PG_DB_URL = os.getenv("PG_DATABASE_URL")


engine = create_engine(PG_DB_URL)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

session = Session()


#! For the Insert the User
# user1 = User("Yash","yash@gmail.com","12345")
# session.add(user1)
# session.commit()
# session.close()
# print("Inserted Sucessfully!")

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
users = session.query(User).all()
for u in users:
    print(u)
session.close()

