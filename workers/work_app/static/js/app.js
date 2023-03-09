function tb_display(table_name) {

    if (table_name === 'r_workers') { 
        
        document.getElementById('table_workers').style.display = 'block';
        document.getElementById('table_vacancy').style.display = 'none';
        document.getElementById('table_category').style.display = 'none';
    }
    if (table_name === 'r_vacancy') {
        
        document.getElementById('table_vacancy').style.display = 'block';
        document.getElementById('table_workers').style.display = 'none';
        document.getElementById('table_category').style.display = 'none';
    }
    if (table_name === 'r_category') {
        
        document.getElementById('table_category').style.display = 'block';
        document.getElementById('table_workers').style.display = 'none';
        document.getElementById('table_vacancy').style.display = 'none';
    }
}

function form_display(form_name) {

  if (form_name === 'form_cat') { 
      
      document.getElementById('add_cat').style.display = 'block';
      document.getElementById('add_vac').style.display = 'none';
      document.getElementById('add_worker').style.display = 'none';
  }
  if (form_name === 'form_vac') {
      
      document.getElementById('add_vac').style.display = 'block';
      document.getElementById('add_worker').style.display = 'none';
      document.getElementById('add_cat').style.display = 'none';
  }
  if (form_name === 'form_worker') {
      
      document.getElementById('add_worker').style.display = 'block';
      document.getElementById('add_cat').style.display = 'none';
      document.getElementById('add_vac').style.display = 'none';
  }
}

function close_form() {

  document.getElementById('add_worker').style.display = 'none';
  document.getElementById('add_cat').style.display = 'none';
  document.getElementById('add_vac').style.display = 'none';

  document.getElementById('f_workers').checked = false
  document.getElementById('f_vacancy').checked = false
  document.getElementById('f_category').checked = false

}

async function send_json_to_server(form_name) {

    const forma = document.getElementById(form_name);
    const formData = new FormData(forma);
    const data = {};
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

async function del_cat(id_cat) {
  const row = document.getElementById('tb_cat_'+id_cat);
  let total = row.getElementsByTagName('td')[2].innerHTML

  if ( total > 0 ) { alert('Нелзя удалять категорию с должносятми') } else {
    row.style.display = 'none';
    let csrf  = row.getElementsByTagName('input').item(0).value;

    let data = {
      type: 'del_cat',
      id: id_cat,
    };

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
}