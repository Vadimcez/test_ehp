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

    const forma = document.getElementById(form_name);
    const formData = new FormData(forma);
    const data = {};
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

function handle(object){
  var inp = document.createElement("input");
  inp.type = "text";
  inp.value = object.innerText;

  object.innerText = "";
  object.appendChild(inp);
  
  var _event = object.onclick;
  object.onclick = null;
  inp.onkeydown = function(e){

      if(e.keyCode === 13){
            object.innerText = inp.value;
            object.onclick = _event;     
      }
  };



}

async function save(row_id,id_db){

  var div = document.getElementById(row_id);
  var spans = div.getElementsByTagName("span");
  let csrf  = div.getElementsByTagName('input').item(0).value;
  console.log(csrf);

  let arr = [];
  arr.push(id_db);
  for(i=0;i<spans.length;i++)
  {   
      arr.push(spans[i].innerHTML);
  }   


  let data = {
    type: 'upd_cat',
    id: arr[0],
    value: arr[1]
  }
  const jsonData = JSON.stringify(data);
     console.log(jsonData);
   
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