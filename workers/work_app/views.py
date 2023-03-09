from django.shortcuts import render, HttpResponse
from .forms import AddCategory, AddWorker, AddHuman
from .services import check_is_unique, check_is_unique_human, check_is_unique_worker
from .models import Category, Worker, Vacancy, Human
from django.views.generic import TemplateView
import json
from django.http import JsonResponse


# Create your views here.

def index(request):

    return render(request, 'index.html',)


class Home(TemplateView):
    template_name = 'home.html'

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
            dry = json.loads(request.body)
            print(dry)
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
            elif dry.get('id_human') != None:
                id_vacancy = dry.get('id_vacancy')
                id_human = dry.get('id_human')
                if check_is_unique_worker(id_human, id_vacancy):
                    Worker.add(Worker, id_human, id_vacancy)
                else:
                    print('Данный сотрудник с такой вакансией уже существует')
                    return JsonResponse(json.dumps('Vacansy exist'), safe=False)    
            
            elif dry.get('type') is not None:
                type = dry.get('type')
                if type == 'del_cat':
                    id_cat = dry.get('id')
                    Category.delete(Category,id_cat)
                elif type =='del_vac':
                    id_vac = dry.get('id')
                    Vacancy.delete(Vacancy,id_vac)
                elif type == 'del_human':
                    id_worker = dry.get('id')
                    Human.delete(Human, id_worker)
                elif type == 'del_worker':
                    id_worker = dry.get('id')
                    Worker.delete(Worker, id_worker)
                elif type == 'upd_cat':
                    id_cat = dry.get('id')
                    value = dry.get('value')
                    if check_is_unique('category','name_category', value):
                        Category.update(Category, id_cat, value)
                    else:
                        print ('Данная категория уже существует')
                        return JsonResponse(json.dumps('fail upd cat'), safe=False)
            else:
                print('error')
                print(dry)
        return JsonResponse(json.dumps('sucsess'), safe=False)