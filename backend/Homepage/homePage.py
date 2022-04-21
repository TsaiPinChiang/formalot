from db.db import get_db
# from db.db import row_to_dict # For sqlite
from flask import Blueprint, request, jsonify
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary

homePage_bp = Blueprint('homePage', __name__)

# DAO
def formRecommendation():

    db = get_db()
    
    # postgresql
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # sqlite (In case postgresql shutdown)
    # db.row_factory = row_to_dict
    # cursor = db.cursor()
    
    try:
        query = """
        SELECT Form.form_id, Form.form_title, Form.form_run_state, Form.form_end_date, Form.form_pic_url, COUNT(DISTINCT UserForm.User_student_id) AS num_answer
        FROM Form
        INNER JOIN UserForm
        ON Form.form_id = UserForm.Form_form_id
        WHERE Form.form_delete_state = 0 AND Form.form_run_state = 'Open'
        GROUP BY Form.form_id;
        """
        cursor.execute(query)
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return 'Failed to retrieve form.'
    finally:
        db.close()


# route
@homePage_bp.route('/home', methods=['GET'])
@swag_from('homePage_specs.yml', methods=['GET'])
def get_formRecommendation():

    sortBy = request.args.get('sortBy')
    result = formRecommendation()
    print(result)
    if sortBy == 'newest':
        result.sort(key=lambda x: x['form_end_date'], reverse = True)
    else: # most popular form first by default
        result.sort(key=lambda x: x['num_answer'], reverse = True)
    return jsonify(result)

if __name__ == '__main__':
    print(formRecommendation())