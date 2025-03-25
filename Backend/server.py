from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import products
from sql_connection import get_sql_connection

app = Flask(__name__)
CORS(app)

connection = get_sql_connection()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/add')
def add_product_page():
    return render_template('add.html')

@app.route('/getProducts', methods=['GET'])
def get_products():
    try:
        product_list = products.get_all_products(connection)
        return jsonify(product_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/addProduct', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        name = data.get('name')
        uom_id = data.get('uom_id')
        price_per_unit = data.get('price_per_unit')

        if not name or not uom_id or not price_per_unit:
            return jsonify({"error": "All fields are required"}), 400

        cursor = connection.cursor()

        cursor.execute("SELECT uom_id FROM uom WHERE uom_id = %s", (uom_id,))
        uom_exists = cursor.fetchone()


        if not uom_exists:
            cursor.execute("INSERT INTO uom (uom_id, uom_name) VALUES (%s, %s)", (uom_id, "Unknown Unit"))
            connection.commit()


        query = "INSERT INTO products (name, uom_id, price_per_unit) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, uom_id, price_per_unit))
        connection.commit()
        cursor.close()

        return jsonify({"message": " Product added successfully!", "product": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/deleteProduct/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        cursor = connection.cursor()
        query = "DELETE FROM products WHERE product_id = %s"
        cursor.execute(query, (product_id,))
        connection.commit()
        cursor.close()
        return jsonify({"message": f" Product {product_id} deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print(" Starting Python Flask server for GigaMart Store Management System...")
    app.run(port=5000, debug=True)
