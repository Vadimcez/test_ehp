from django.shortcuts import render
from .forms import AddCategory, AddWorker, AddHuman
from .services import check_is_unique, check_is_unique_human, check_is_unique_worker
from .models import Category, Worker, Vacancy, Human
from django.views.generic import TemplateView
import json
from django.http import JsonResponse


# Create your views here.

class Home(TemplateView):
    template_name = 'index.html'

    def get(self, request):
        form_cat = AddCategory()
        form_work = AddWorker()  
        form_human = AddHuman()
        tb_workers = Worker.all(Worker)
        tb_human = Human.all(Human)
        all_vacancy = Vacancy.all_json(Vacancy)
        tb_category = Category.all_json(Category)
        tb_vacancy = Vacancy.full_table(Vacancy)
        return render(request, self.template_name, 
        {'form_cat':form_cat, 'form_work':form_work, 'form_human':form_human,'all_vacancy': all_vacancy, 
         'tb_category': tb_category,'tb_workers':tb_workers, 'tb_vacancy': tb_vacancy, 'tb_human': tb_human })
    
    def post(self, request):
        if request.method == 'POST':
            json_client = json.loads(request.body)
            print(json_client)
                        
            if json_client.get('add') is not None:
                add_json = json_client.get('add') 
                if add_json == 'add_category':
                    cat_name = json_client.get('name_category')
                    if check_is_unique('category', 'name_category', cat_name):
                        Category.add(Category, cat_name)
                    else:
                        print('Данная категория уже существует')
                        return JsonResponse(json.dumps('Category exist'), safe=False)
                elif add_json == ('add_vac'):
                    id_category = json_client.get('id_category')
                    vac_name = json_client.get('name_add_vacancy')
                    if check_is_unique('vacancy', 'name_vacancy', vac_name):
                        Vacancy.add(Vacancy, vac_name, id_category)
                    else:
                        print('Данная вакансия уже существует')
                        return JsonResponse(json.dumps('Vacansy exist'), safe=False)            
                elif add_json == 'add_human':
                    last_name = json_client.get('last_name')
                    first_name = json_client.get('first_name')
                    middle_name = json_client.get('middle_name')
                    date_birth = json_client.get('date_birth')
                    gen = json_client.get('gender')
                    tb_human_upd = Human.all(Worker)
                    tb_upd = json.dumps(tb_human_upd, ensure_ascii=False)
                    if check_is_unique_human(last_name, first_name, middle_name,gen,date_birth):
                        Human.add(Human, last_name, first_name, middle_name, gen, date_birth, )
                        tb_human_upd = Human.all(Worker)
                        return JsonResponse({'tb_upd':tb_upd}, json_dumps_params={'ensure_ascii': False}, safe=False)
                    else:
                        error_add_worker = 'Физ лицо с таким ФИО и датой рождения уже существует'
                        print(error_add_worker)
                        return JsonResponse(json.dumps('Human exist'), safe=False)
                elif add_json == 'add_worker':
                    id_vacancy = json_client.get('id_vacancy')
                    id_human = json_client.get('id_human')
                    if check_is_unique_worker(id_human, id_vacancy):
                        Worker.add(Worker, id_human, id_vacancy)
                    else:
                        print('Данный сотрудник с такой вакансией уже существует')
                        return JsonResponse(json.dumps('Vacansy exist'), safe=False)    
            
            elif json_client.get('type') is not None:
                type_json = json_client.get('type')
                if type_json == 'del_cat':
                    id_cat = json_client.get('id')
                    Category.delete(Category,id_cat)
                elif type_json =='del_vac':
                    id_vac = json_client.get('id')
                    Vacancy.delete(Vacancy,id_vac)
                elif type_json == 'del_human':
                    id_worker = json_client.get('id')
                    Human.delete(Human, id_worker)
                elif type_json == 'del_worker':
                    id_worker = json_client.get('id')
                    Worker.delete(Worker, id_worker)
                elif type_json == 'upd_cat':
                    id_cat = json_client.get('id')
                    value = json_client.get('value')
                    if check_is_unique('category','name_category', value):
                        Category.update(Category, id_cat, value)
                    else:
                        print ('Данная категория уже существует')
                        return JsonResponse(json.dumps('fail upd category'), safe=False)
                elif type_json == 'upd_vac':
                    id_vac = json_client.get('id')
                    vac_name = json_client.get('vac_name')
                    cat_id = json_client.get('cat_id')
                    if check_is_unique('vacancy','name_vacancy', vac_name):
                        Vacancy.update(Vacancy, id_vac, vac_name, cat_id)
                    else:
                        print ('Данная вакансия уже существует')
                        return JsonResponse(json.dumps('fail upd vacancy'), safe=False)
                elif type_json == 'upd_human':
                    id = json_client.get('id')
                    last_name = json_client.get('last_name')
                    first_name = json_client.get('first_name')
                    middle_name = json_client.get('middle_name')
                    date_birth = json_client.get('date_birth')
                    gender = json_client.get('gender')
                    if check_is_unique_human(last_name, first_name, middle_name, gender, date_birth):  
                        Human.update(Human, id, last_name, first_name, middle_name, gender, date_birth)
                    else:
                        print ('Данный человек уже существует')
                        return JsonResponse(json.dumps('fail upd human'), safe=False)
                elif type_json == 'upd_worker':
                    id_db = json_client.get('id')
                    id_human = json_client.get('id_human')
                    id_vacancy = json_client.get('id_vacancy')
                    Worker.update(Worker, id_db, id_vacancy, id_human)
                    
            else:
                print('error')
                print(json_client)
        return JsonResponse(json.dumps('sucsess'), safe=False)