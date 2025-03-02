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


if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_products(connection))
