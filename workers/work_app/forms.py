from django import forms
from .models import Category, Human, Vacancy


class AddCategory(forms.Form):
    name_category = forms.CharField(max_length=120, label='Новая категория', widget=forms.TextInput(attrs={'class': 'form-control'}))
  
class AddVacancy(forms.Form):
    rows_cat = Category.all(Category)
    id_category = forms.ChoiceField(choices=rows_cat, label='Категория')
    name_add_vacancy = forms.CharField(max_length=200, label='Название')  
    
class AddHuman(forms.Form):
    last_name = forms.CharField(max_length=150, label='Фамилия', widget=forms.TextInput(attrs={'class': 'form-control'}))
    first_name = forms.CharField(max_length=100, label='Имя', widget=forms.TextInput(attrs={'class': 'form-control'}))
    middle_name = forms.CharField(max_length=100, label='Отчество', widget=forms.TextInput(attrs={'class': 'form-control'}))
    date_birth = forms.DateField(label='Дата рождения', widget=forms.TextInput(attrs={'class': 'form-control'}))
    male = "муж"; female = "жен"
    gen = [(male,'муж'),(female, 'жен')] 
    gender = forms.ChoiceField(choices=gen, label='Пол', widget=forms.Select(attrs={'class': 'form-select'}))
    
    #rows_vac = Vacancy.all(Vacancy)
    #vac = forms.ChoiceField(choices=rows_vac, label='Вакансии')    

class AddWorker(forms.Form):
    rows_human = Human.all(Human)
    id_human = forms.ChoiceField(choices=rows_human, label='Физ. лицо')
    rows_vacancy = Vacancy.all(Vacancy)
    id_vacancy = forms.ChoiceField(choices=rows_vacancy, label='Должность')