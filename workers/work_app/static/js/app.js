function tb_display(table_name) {

  if (table_name === 'r_human') { 
      
    document.getElementById('table_human').style.display = 'block';
    document.getElementById('table_vacancy').style.display = 'none';
    document.getElementById('table_category').style.display = 'none';
    document.getElementById('table_worker').style.display = 'none';
  }
  if (table_name === 'r_vacancy') {
      
    document.getElementById('table_human').style.display = 'none';
    document.getElementById('table_vacancy').style.display = 'block';
    document.getElementById('table_category').style.display = 'none';
    document.getElementById('table_worker').style.display = 'none';
  }
  if (table_name === 'r_category') {
      
    document.getElementById('table_human').style.display = 'none';
    document.getElementById('table_vacancy').style.display = 'none';
    document.getElementById('table_category').style.display = 'block';
    document.getElementById('table_worker').style.display = 'none';
  }

  if (table_name === 'r_worker') {
      
    document.getElementById('table_human').style.display = 'none';
    document.getElementById('table_vacancy').style.display = 'none';
    document.getElementById('table_category').style.display = 'none';
    document.getElementById('table_worker').style.display = 'block';
  }

} 
function form_display(form_name) {

  if (form_name === 'form_worker') {
      
    document.getElementById('add_worker').style.display = 'block';
    document.getElementById('add_human').style.display = 'none';
    document.getElementById('add_cat').style.display = 'none';
    document.getElementById('add_vac').style.display = 'none';
  }

  if (form_name === 'form_human') {
      
    document.getElementById('add_worker').style.display = 'none';
    document.getElementById('add_human').style.display = 'block';
    document.getElementById('add_cat').style.display = 'none';
    document.getElementById('add_vac').style.display = 'none';
  } 
 
  if (form_name === 'form_cat') { 
      
    document.getElementById('add_worker').style.display = 'none';
    document.getElementById('add_human').style.display = 'none';
    document.getElementById('add_cat').style.display = 'block';
    document.getElementById('add_vac').style.display = 'none';
  }

  if (form_name === 'form_vac') {
      
    document.getElementById('add_worker').style.display = 'none';
    document.getElementById('add_human').style.display = 'none';
    document.getElementById('add_cat').style.display = 'none';
    document.getElementById('add_vac').style.display = 'block';
  }

}

function close_form() {

  document.getElementById('add_worker').style.display = 'none';
  document.getElementById('add_cat').style.display = 'none';
  document.getElementById('add_vac').style.display = 'none';
  document.getElementById('add_human').style.display = 'none';

  document.getElementById('f_workers').checked = false
  document.getElementById('f_vacancy').checked = false
  document.getElementById('f_category').checked = false
  document.getElementById('f_human').checked = false

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
    console.log(data)
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
      // data.push(select.options[i].value);
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
    document.getElementById("name_edit_category").value = arr[2]
    document.getElementById("cat_id_db_row").value = arr[0]
  }

  if ( edit_type === 'vacancy' ) {
    document.getElementById("vac_id_db_row").value = arr[0]
      let select = document.getElementById('select_edit_category')

    document.getElementById('select_edit_category').value = set_select(select, arr[3]);
    document.getElementById('name_edit_vacancy').value = arr[2];
  }


  if (edit_type === 'human') {
    console.log(arr)
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
    var div = document.getElementById('edit_worker');
    let selects = div.querySelectorAll('select')

    document.getElementById("worker_id_db_row").value = arr[0]

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
     //console.log(jsonData);
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