from django.shortcuts import render, HttpResponse
from .forms import AddCategory, AddVacancy, AddWorker
from .services import check_is_unique, check_is_unique_worker
from .models import Category, Worker, Vacancy
from django.views.generic import TemplateView
from django.db import connection
import json
from django.http import JsonResponse


# Create your views here.

def index(request):
    form_cat = AddCategory(request.POST)
    if request.method == 'POST' and 'button-cat' in request.POST:

        if form_cat.is_valid():
            name = form_cat.cleaned_data['name_category']          
            if check_is_unique('category', 'name_category', name):
                Category.add(Category, name)
            else:
                print('Данная категория уже существует')
                return HttpResponse('Данная категория уже существует')
    else:
        form_cat = AddCategory()
            
    form_vac = AddVacancy(request.POST) 
    if request.method == 'POST' and 'button-vac' in request.POST:
        if form_vac.is_valid():
            vac_name = form_vac.cleaned_data['name_add_vacancy']
            id_category = form_vac.cleaned_data['id_category']
            if check_is_unique('vacancy', 'name_vacancy', vac_name):
                Vacancy.add(Vacancy, vac_name, id_category)
            else:
                print('Данная вакансия уже существует')
                return HttpResponse('Данная вакансия уже существует')
    else:
        form_vac = AddVacancy()
    
    form_worker = AddWorker(request.POST)
    if request.method == 'POST' and 'button-work' in request.POST:
        if form_worker.is_valid():
            last_name = form_worker.cleaned_data['last_name']
            first_name = form_worker.cleaned_data['first_name']
            middle_name = form_worker.cleaned_data['middle_name']
            date_birth = form_worker.cleaned_data['date_birth']
            gen = form_worker.cleaned_data['gender']
            vacancy_id = form_worker.cleaned_data['vac']
            if check_is_unique_worker(last_name, first_name, middle_name, date_birth, vacancy_id, gen):
                Worker.add(Worker, last_name, first_name, middle_name, date_birth, vacancy_id, gen)
            else:
                error_add_worker = 'Сотрудник с таким ФИО, датой рождения, вакансией уже существует'
                print(error_add_worker)
                return HttpResponse(error_add_worker)
                
    else:
        form_worker = AddWorker()      
    
    sql_1 = ("SELECT worker.id, CONCAT(last_name,' ',first_name,' ',middle_name) AS ФИО, CAST(EXTRACT(year from AGE(date_birth)) AS INT) AS Возраст, gender AS Пол, \
name_vacancy AS Должность, name_category AS Категория FROM public.worker INNER JOIN vacancy ON worker.vacancy_id = vacancy.id INNER JOiN category ON \
vacancy.id = category.id;")
    with connection.cursor() as cursor:
        cursor.execute(sql_1)
        query_results = cursor.fetchall()
    #print ('query_results ',query_results)
    return render(request, 'index.html', {'form_cat': form_cat, 'form_vac': form_vac, 
        'form_worker':  form_worker, 'query_results': query_results})


class Home(TemplateView):
    template_name = 'home.html'

    def get(self, request):
        form_cat = AddCategory()
        form_work = AddWorker()  
        tb_workers = Worker.all(Worker)
        all_vacancy = Vacancy.all_json(Vacancy)
        tb_category = Category.all_json(Category)
        tb_vacancy = Vacancy.full_table(Vacancy)
        return render(request, self.template_name, 
        {'form_cat':form_cat, 'form_work':form_work,'tb_category': tb_category,
         'all_vacancy': all_vacancy,
         'tb_workers':tb_workers, 'tb_vacancy': tb_vacancy})
    
    def post(self, request):
        if request.method == 'POST':
            dry = json.loads(request.body)
            #print(dry)
            if dry.get('name_category') != None:
                cat_name = dry.get('name_category')
                if check_is_unique('category', 'name_category', cat_name):
                    Category.add(Category, cat_name)
                else:
                    print('Данная категория уже существует')
                    return JsonResponse(json.dumps('Category exist'), safe=False)
            elif dry.get('id_category') != None:
                id_category = dry.get('id_category')
                vac_name = dry.get('name_add_vacancy')
                if check_is_unique('vacancy', 'name_vacancy', vac_name):
                    Vacancy.add(Vacancy, vac_name, id_category)
                else:
                    print('Данная вакансия уже существует')
                    return JsonResponse(json.dumps('Vacansy exist'), safe=False)            
            elif dry.get('last_name') != None:
                last_name = dry.get('last_name')
                first_name = dry.get('first_name')
                middle_name = dry.get('middle_name')
                date_birth = dry.get('date_birth')
                gen = dry.get('gender')
                vacancy_id = dry.get('vac')
                tb_workers_upd = Worker.all(Worker)
                tb_upd = json.dumps(tb_workers_upd, ensure_ascii=False)
                if check_is_unique_worker(last_name, first_name, middle_name, date_birth, vacancy_id, gen):
                    Worker.add(Worker, last_name, first_name, middle_name, date_birth, vacancy_id, gen)
                    tb_workers_upd = Worker.all(Worker)
                    return JsonResponse({'tb_upd':tb_upd}, json_dumps_params={'ensure_ascii': False}, safe=False)
                else:
                    error_add_worker = 'Сотрудник с таким ФИО, датой рождения, вакансией уже существует'
                    print(error_add_worker)
                    return JsonResponse(json.dumps('Worker exist'), safe=False)
            elif dry.get('type') is not None:
                type = dry.get('type')
                if type == 'del_cat':
                    id_cat = dry.get('id')
                    Category.delete(Category,id_cat)
                elif type =='del_vac':
                    id_vac = dry.get('id')
                    Vacancy.delete(Vacancy,id_vac)
                elif type == 'del_worker':
                    id_worker = dry.get('id')
                    Worker.delete(Worker, id_worker)
            else:
                print('error')
                print(dry)
        return JsonResponse(json.dumps('sucsess'), safe=False)