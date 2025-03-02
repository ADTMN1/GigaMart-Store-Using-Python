from sql_connection import get_sql_connection

def get_all_products(connection):

    cursor = connection.cursor()

    query = """
    SELECT p.product_id, p.name, u.uom_name, p.price_per_unit 
    FROM product p 
    JOIN uom u ON p.uom_id = u.uom_id
    """

    cursor.execute(query)

    response = []
    for (product_id, name, uom_name, price_per_unit) in cursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'uom_name': uom_name,
            'price_per_unit': price_per_unit
        })

    return response

def insert_new_product(connection,product):
    cursor = connection.cursor()
    query = ("INSERT INTO product "
             "(name,uom_id,price_per_unit)"
             " values (%s, %s,%s)")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])
    cursor.execute(query,data)
    connection.commit()
    return cursor.lastrowid


def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = "DELETE FROM product WHERE product_id = %s"
    cursor.execute(query,(product_id,))
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    print(delete_product(connection,3))
