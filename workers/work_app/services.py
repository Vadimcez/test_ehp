from psycopg2 import sql
from django.db import connection


def check_is_unique(table_name: str, column: str, value: str) -> bool:
    """Вернет True если в таблице отсутсвует значение, иначе возвращает False"""

    with connection.cursor() as cursor:
        sql_chk=sql.SQL("SELECT id FROM {0} WHERE {1}='{2}'".format((table_name),(column),(value)))        
        cursor.execute(sql_chk)
        row = cursor.fetchone()

        if row is None:           
            return True
        else:       
            return False

def check_is_unique_worker(ls_name:str, fr_name:str, md_name:str, birthday, vac:id, gen: str):
    """Вернет True если в таблице отсутсвует значение, иначе возвращает False"""
    with connection.cursor() as cursor:
        sql_chk_worker=sql.SQL("SELECT id FROM worker WHERE last_name='%s' AND first_name='%s' \
        AND middle_name='%s' AND date_birth='%s' AND vacancy_id = %s AND gender = '%s' " % (ls_name, fr_name, md_name, birthday, vac, gen))
        cursor.execute(sql_chk_worker)
        row = cursor.fetchone()
        
        if row is None:           
            return True
        else:
            return False
        