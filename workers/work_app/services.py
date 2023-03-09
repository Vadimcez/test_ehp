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

def check_is_unique_human(ls_name:str, fr_name:str, md_name:str, gen: str, birthday ):
    """Вернет True если в таблице отсутсвует значение, иначе возвращает False"""
    with connection.cursor() as cursor:
        sql_chk_human=sql.SQL("SELECT id FROM human WHERE last_name='%s' AND first_name='%s' \
        AND middle_name='%s'AND gender = '%s' AND date_birth='%s'  " % (ls_name, fr_name, md_name, gen, birthday, ))
        cursor.execute(sql_chk_human)
        row = cursor.fetchone()
        
        if row is None:           
            return True
        else:
            return False
        
def check_is_unique_worker(id_human: int, id_vacancy: int):
        """Вернет True если в таблице отсутсвует значение, иначе возвращает False"""
        with connection.cursor() as cursor:
            sql_chk_worker=sql.SQL("SELECT id FROM worker WHERE vacancy_id = %s AND human_id = %s" % (id_vacancy, id_human ))
            cursor.execute(sql_chk_worker)
            row = cursor.fetchone()
        
        if row is None:           
            return True
        else:
            return False