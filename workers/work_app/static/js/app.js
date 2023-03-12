var arr_table = ['table_vacancy', 'table_category', 'table_worker', 'table_human']
var arr_form = ['add_cat', 'add_vac','add_human','add_worker'] // порядок важен для функции display
var check_box = ['f_workers','f_vacancy','f_category','f_human']
var edit_form = ['edit_cat','edit_vac','edit_human', 'edit_worker' ]


function tb_display(table_name) {
  
    for (let i = 0; i < arr_table.length; i++) {
      document.getElementById(arr_table[i]).style.display ='none';
    }
      if (table_name === 'r_human') {   
        document.getElementById('table_human').style.display = 'table'; }
      if (table_name === 'r_vacancy') {
        document.getElementById('table_vacancy').style.display = 'table'; }
      if (table_name === 'r_category') {   
        document.getElementById('table_category').style.display = 'table'; }
      if (table_name === 'r_worker') {
        document.getElementById('table_worker').style.display = 'table'; }
} 
function form_display(form_name) {

    for ( let i= 0 ; i < arr_form.length ; i++ ) {  
      if (form_name == arr_form[i]) {   
        document.getElementById(arr_form[i]).style.display = 'block';  }
      else { 
        document.getElementById(arr_form[i]).style.display = 'none';  }
    }
}

function edit_display(edit) {

  for (let i=0; i <edit_form.length; i++) {
    if (edit == edit_form[i]) {
    document.getElementById(edit_form[i]).style.display = 'block'; }
    else { document.getElementById(edit_form[i]).style.display = 'none'; }
  }   
}

function close_form(name) {
    document.getElementById(name).style.display = 'none';

    if ( 1 >= name.indexOf('add') ) {
      for (let i = 0; i < check_box.length; i++) {
        document.getElementById(check_box[i]).checked = false;}
    }
    // for (let i = 0; i < arr_form.length; i++ ) {
    //   document.getElementById(arr_form[i]).style.display = 'none';}



    // for (let i = 0; i < edit_form.length; i++) {
    //   document.getElementById(edit_form[i]).style.display = 'none';}
}



async function send_json_to_server(form_name) {

  var forma = document.getElementById(form_name);
  var formData = new FormData(forma);
  var data = {};

    switch(form_name) {
      case 'form_category':
        {data['add'] = 'add_category';        
        break;
        }
      case 'form_worker':
        {data['add'] = 'add_worker';        
        break;
        }
      case 'form_vac':
        {data['add'] = 'add_vac';       
        break;
        }
      case 'form_human':
        {data['add'] = 'add_human';       
        break;
        }
    }

    for (let key of formData.keys()) {
      data[key] = formData.get(key);
    }
    save_csrf = data['csrfmiddlewaretoken'];
    delete data['csrfmiddlewaretoken'];
    const jsonData = JSON.stringify(data);
    //console.log(jsonData)
    
      const url = 'http://127.0.0.1:8000/home/';
      
        try {
          const response = await fetch(url, {
            method: 'POST', 
            body: jsonData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-CSRFToken': save_csrf,
            }
          });
              
        } 
        catch (error) {
          console.error('Ошибка:', error);
        }  
}

async function del_row(id, tb_name, type_data) {
  const row = document.getElementById(tb_name+id);

  if ( tb_name === 'tb_cat_' ) { 
    let total = row.getElementsByTagName('td')[2].innerHTML 
    if ( total > 0 ) { alert('Нелзя удалять категорию с должносятми')
    return; }
  }
    row.style.display = 'none';
    let csrf  = row.getElementsByTagName('input').item(0).value;

    let data = {
      type: type_data,
      id: id,
    };
    console.log(data);
    const jsonData = JSON.stringify(data);
      
      const url = 'http://127.0.0.1:8000/home/';
      
      try {
        const response = await fetch(url, {
          method: 'POST', 
          body: jsonData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrf,
          }
        });  
      } 
      catch (error) {
        console.error('Ошибка:', error);
      }
  
}


function edit(type,row_id,id_db){
  var edit_type = type
  var div = document.getElementById(row_id);
  var span = div.getElementsByTagName("span");

  function set_select(select, arr_index) {
    const cat_obj = {}
    for (i = 0; i < select.length; i++) { 
      cat_id = select.options[i].value;
      cat_name = select.options[i].text;
      cat_obj[i] = {cat_id: cat_id, cat_name: cat_name}
    }
    for (i = 0; i < Object.keys(cat_obj).length; i++) {
      if (cat_obj[i].cat_name === arr_index) { 
        return id_select = cat_obj[i].cat_id
      }  
    }
  }

    let arr = [];
  arr.push(id_db);
  for(i=0;i<span.length;i++)
  {   
      arr.push(span[i].innerText);
  }  

  if ( edit_type === 'category' ) {
    edit_display('edit_cat')
    document.getElementById("name_edit_category").value = arr[2]
    document.getElementById("cat_id_db_row").value = arr[0]
  }

  if ( edit_type === 'vacancy' ) {
    edit_display('edit_vac')
    document.getElementById("vac_id_db_row").value = arr[0]
      let select = document.getElementById('select_edit_category')
      document.getElementById('select_edit_category').value = set_select(select, arr[3]);
      document.getElementById('name_edit_vacancy').value = arr[2];
  }

  if (edit_type === 'human') {
    edit_display('edit_human')
    
    document.getElementById("human_id_db_row").value = arr[0]
    var div = document.getElementById('edit_human');
    let inputs = div.querySelectorAll('input[type=text]');
    let select = div.querySelector('select');
    let fio = arr[1].split(' ');
    

    for (i = 0; i < fio.length; i++) {
        inputs[i].value = fio[i]
    }
    inputs[3].value = arr[3]
    select.value = arr[2]
  }

  if (edit_type === 'worker' ){
    edit_display('edit_worker')
    var div = document.getElementById('edit_worker');
    document.getElementById("worker_id_db_row").value = arr[0]
    let selects = div.querySelectorAll('select')   
      selects[1].value = set_select(selects[1], arr[2])
      selects[0].value = set_select(selects[0], arr[3])
  }

}


async function update(form){

  var div = document.getElementById(form);
  var csrf  = div.getElementsByTagName('input').item(0).value;
  var db_id =  div.getElementsByTagName('input').item(1).value;
  var inputs = div.getElementsByTagName('input')
  var arr = [];
  for(i=2;i<inputs.length;i++)
  {      
    arr.push(inputs.item(i).value);
  }  

if (form == 'edit_cat') {
  cat_obj = {}
    
  console.log(arr)

    let data = {
    type: 'upd_cat',
    id: db_id,
    vac_name: arr[0],
  }
  var jsonData = JSON.stringify(data);

}

  if (form == 'edit_vac') {
    let select = div.getElementsByTagName('select').item(0)
    cat_obj = {}
    for (i = 0; i < select.length; i++) { 
        
        cat_id = select.options[i].value;
        cat_name = select.options[i].text;
        cat_obj[i] = {cat_id: cat_id, cat_name: cat_name}
      }
    id_cat = select.value
    arr.push(id_cat)
    

      let data = {
      type: 'upd_vac',
      id: db_id,
      vac_name: arr[0],
      cat_id: arr[1]
    }
    var jsonData = JSON.stringify(data);
      console.log(jsonData);
  }
   
  if (form == 'edit_human') { 
    let inputs = div.querySelectorAll('input[type=text]')
    let select = div.querySelector('select')
    arr = []
    for (let i = 0; i < inputs.length; i++) {
      arr.push(inputs[i].value)
    }
      arr.push(select.value)
      console.log(arr)

      let data = {
        type: 'upd_human',
        id: db_id,
        last_name: arr[0],
        first_name: arr[1],
        middle_name: arr[2],
        date_birth: arr[3],
        gender: arr[4]
      }
      var jsonData = JSON.stringify(data);
        console.log(jsonData);
  }


  if (form == 'edit_worker') {
    let selects = div.querySelectorAll('select')
    arr = []
    for (let i = 0; i < selects.length; i++) {
      arr.push(selects[i].value)
    }

    let data = {
      type: 'upd_worker',
      id: db_id,
      id_vacancy: arr[0],
      id_human: arr[1],
    }
    var jsonData = JSON.stringify(data);
      console.log(jsonData);

  }

  const url = 'http://127.0.0.1:8000/home/';
    
  try {
    const response = await fetch(url, {
      method: 'POST', 
      body: jsonData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrf,
      }
    });
    
  } 
  catch (error) {
    console.error('Ошибка:', error);
  }

}