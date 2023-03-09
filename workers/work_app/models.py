from django.db import models, connection
from psycopg2 import sql
import json

# Create your models here.
class Category(models.Model):
    class Meta:
        db_table = 'category'

    name_category = models.CharField(max_length=120)

    def add(self, name_cat:str):
        with connection.cursor() as cursor:
            sql_add_cat = sql.SQL("INSERT INTO category (name_category) VALUES ('%s')" % name_cat)

            cursor.execute(sql_add_cat)
            print('Add Category %s ' % name_cat)
            print(sql_add_cat)

    def all(self):
        """Return all values of the Category from database"""
        with connection.cursor() as cursor:
            sql_get_categories = "SELECT id, name_category FROM category"
            cursor.execute(sql_get_categories)
            rows = cursor.fetchall()
            return rows
    
    def all_json(self):
        """Return all values of the Category from database As JSON"""
        with connection.cursor() as cursor:
            sql_get_categories = "SELECT category.id, category.name_category, COUNT(vacancy.category_vacancy_id) AS total_vacancy \
                FROM category LEFT JOIN vacancy ON vacancy.category_vacancy_id = category.id GROUP BY category.id ORDER BY category.id"
            cursor.execute(sql_get_categories)
            rows = cursor.fetchall()
        keys = ("id","name_category", "total_vacancy")
        json_dict = [dict(zip(keys, row)) for row in rows] 
        data_json = json.dumps(json_dict, ensure_ascii = False)     
        data = json.loads(data_json)
        return data  
    
    def delete(self, id):
        try:
            with connection.cursor() as cursor:
                sql_del_cat = "DELETE FROM category WHERE id = %s" % id
                cursor.execute(sql_del_cat)
                print(sql_del_cat)
        except Exception as e: 
            print(e)
             
    
class Vacancy(models.Model):
    class Meta:
        db_table = 'vacancy'

    name_vacancy = models.CharField(max_length=200)
    category_vacancy = models.ForeignKey(Category, on_delete=models.CASCADE)

    def add(self, name_vacancy:str, id_category:int):
        with connection.cursor() as cursor:
            sql_add_vac = sql.SQL("INSERT INTO vacancy (name_vacancy, category_vacancy_id) VALUES  \
                ('%s', %s)" % (name_vacancy, id_category))
            cursor.execute(sql_add_vac)
            print('Add Vacancy %s ' % name_vacancy)         
            print(sql_add_vac)
    
    def all(self):
        """Return values of all vacancy from database"""
        with connection.cursor() as cursor:
            sql_get_vacany = "SELECT id, name_vacancy FROM vacancy"
            cursor.execute(sql_get_vacany)
            rows = cursor.fetchall()
        return rows
    
    def all_json(self):
        with connection.cursor() as cursor:
            sql_get_vacany = "SELECT id, name_vacancy FROM vacancy"
            cursor.execute(sql_get_vacany)
            rows = cursor.fetchall()
        keys = ("id","name_vacancy")
        json_dict = [dict(zip(keys, row)) for row in rows] 
        data_json = json.dumps(json_dict, ensure_ascii = False)     
        data = json.loads(data_json)
        return data
            
    def full_table(self):
        with connection.cursor() as cursor:
            sql_get_vacany = "SELECT vacancy.id, vacancy.name_vacancy, category.name_category \
                FROM vacancy INNER JOIN category ON vacancy.category_vacancy_id = category.id"
            cursor.execute(sql_get_vacany)
            rows = cursor.fetchall()          
        keys = ("id","name_vacancy", "category_vacancy")
        json_dict = [dict(zip(keys, row)) for row in rows] 
        data_json = json.dumps(json_dict, ensure_ascii = False)     
        data = json.loads(data_json)
        return data
    
    def delete(self, id):
        try:
            with connection.cursor() as cursor:
                sql_del_vac = "DELETE FROM vacancy WHERE id = %s" % id
                cursor.execute(sql_del_vac)
                print(sql_del_vac)
        except Exception as e: 
            print(e)
        
    
    def __str__(self):
        return self.name_vacancy
             

class Worker(models.Model):
    class Meta:
        db_table = 'worker'
        
    last_name = models.CharField(max_length=150)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=8, default='муж')
    date_birth = models.DateField()
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE)
    
    
    def add(self, last_name:str, first_name:str, middle_name:str, date_birth, id_vacancy:int, gender:str):
        with connection.cursor() as cursor:
            sql_add_worker = sql.SQL("INSERT INTO worker (last_name, first_name, middle_name, date_birth, vacancy_id, gender) VALUES  \
                ('%s', '%s', '%s', '%s', %s, '%s')" % (last_name, first_name, middle_name, date_birth, id_vacancy, gender))
            cursor.execute(sql_add_worker)
            print('Add Worker')
            print(sql_add_worker)
    
    def all(self):
        """return all values workers from database"""
        
        with connection.cursor() as cursor:
            sql_1 = ("SELECT worker.id, CONCAT(last_name,' ',first_name,' ',middle_name) AS ФИО, CAST(EXTRACT(year from AGE(date_birth))AS INT) AS Возраст, gender AS Пол, \
            name_vacancy AS Должность, name_category AS Категория FROM public.worker INNER JOIN vacancy ON worker.vacancy_id = vacancy.id INNER JOiN category ON \
             vacancy.category_vacancy_id = category.id ORDER BY worker.id DESC;")      
            cursor.execute(sql_1)
            rows = cursor.fetchall()
        keys = ("id","fio","age","gen", "vac", "cat")
        json_dict = [dict(zip(keys, row)) for row in rows] 
        data_json = json.dumps(json_dict, ensure_ascii = False)     
        table_data = json.loads(data_json)
        #print(table_data)
        return table_data
    
    def delete(self,id):
        try:
            with connection.cursor() as cursor:
                sql_del_worker = "DELETE FROM worker WHERE id = %s" % id
                cursor.execute(sql_del_worker)
                print(sql_del_worker)
        except Exception as e: 
            print(e)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
            