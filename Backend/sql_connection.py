import mysql.connector

__conn =None

def get_sql_connection():
    global __conn
    if __conn is None:
        __conn = mysql.connector.connect(user='gigamart'
        ,password='root',host='127.0.0.1',database='grocery_store',port=8889 )
    return __conn