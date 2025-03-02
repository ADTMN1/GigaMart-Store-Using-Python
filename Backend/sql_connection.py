import mysql.connector

conn = mysql.connector.connect(
    host="127.0.0.1",  # Use 127.0.0.1 instead of 'localhost'
    user="gigamart",
    password="root",
    database="grocery_store",
    port=8889  # MAMP's default MySQL port
)

if conn.is_connected():
    print("Connected to MySQL database!")

conn.close()
