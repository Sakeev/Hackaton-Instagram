const API = 'http://localhost:8000/users'; 
 
// Переменные инпутов для добавления постов 
let inp = $('.inp'); 
let image = $('#image'); 
let descr = $('#descr'); 
let btnAdd = $('#btn-add') 
 
//Переменные инпутов для измененмя постов 
let editImage = $('#edit-image'); 
let editDescr = $('#edit-descr'); 
let editSaveBtn = $('#btn-save-edit'); 
let editFormModal =$('#exampleModal'); 
let btnDelete = $('#btn-save-delete')

// Блок для добавления постов 
let list = $('#add-post'); 
 
//? Для поиска 
let search = $('#search'); 
let searchVal = ''; 
 
//? Пагинация 
let currentPage = 1; 
let pageTotalCount = 1; 
let prev =$('.prev'); 
let next = $('.next'); 
let paginationList = $('.pagination-list') 
 
 
 
 
 
////////////////////////////////////////////////////////////////////////////////////////////////////// 
render(); 
 
btnAdd.on('click', function(){ 
    let obj={ 
        image: image.val(), // Вытаскивает значение инпутов 
        descr: descr.val() 
    }; 
    setItemToJson(obj); 
    inp.val(''); // Очищает значения внутри функции 
}); 
 
 
function setItemToJson(obj){ //Отправка запросов 
     
    fetch(API, { 
        method:"POST", 
        headers:{ 
            'Content-type': "application/json; charset=utf-8", 
        }, 
        body: JSON.stringify(obj), 
    }).then(() => { 
        render() 
    }) 
}; 
 
// Отображение 
 
function render(){ 
    fetch(`${API}?q=${searchVal}&_limit=6&_page=${currentPage}`).then((res) => res.json()).then((data) => { 
        list.html('');   // Удаляет 
 
        data.forEach((element) => { 
            let item = drawProductCard(element); 
            list.append(item); 
        }); 
        drawPaginationButtons(); 
    }) 
 
} 
 
 
// Верстка 
function drawProductCard(element){ 
    return ` 
    <div class="card m-3" style="width: 18rem;"> 
    <a href="#" class="btn btn-dark btn-delete btn-edit" id=${element.id} data-bs-toggle="modal"  
    data-bs-target="#exampleModal">...</a>
    <img src=${element.image} class="card-img-top" alt="..."> 
    <i class="fa-solid fa-heart"></i> 
    <p class="card-text">${element.descr}</p> 
    </div>` 
}; 
 

// Удаление 



$('body').on('click', '.btn-delete', function(){
    btnDelete.attr('id', this.id) //Записываем  ID аккаунта 

 })


btnDelete.on('click', function(e){
    deleteInfo(e.target.id); 
})
function deleteInfo(id){ 
    fetch(`${API}/${id}`, { 
        method: 'DELETE', 
    }).then(()=>{ 
        render(); 
        editFormModal.modal('hide') 
    }) 
} 


 
//!EDIT 
$('body').on('click', '.btn-edit', function(){ 
    fetch(`${API}/${this.id}`).then((res)=>res.json()).then((data)=>{  
        editDescr.val(data.descr);  //Заполняем поля данными 
        editImage.val(data.image); 
        editSaveBtn.attr('id', data.id) //Записываем  ID аккаунта 
    }) 
}); 
 
editSaveBtn.on('click', function(){ 
    let id = this.id; 
    let image = editImage.val(); 
    let descr = editDescr.val(); 
    let edittedProduct = { 
        image: image, 
        descr: descr, 
    }; 
    saveEdit(edittedProduct, id); 
    render()
}); 
 
 
// Функция для удаления 
 
function saveEdit(edittedProduct, id){ 
    fetch(`${API}/${id}`, { 
        method: 'PUT', 
        headers: { 
            'Content-type': 'application/json' 
        }, 
        body: JSON.stringify(edittedProduct), 
    }).then(()=>{ 
        render(); 
        editFormModal.modal('hide') 
    }) 
} 
 
 
// ! ПОИСК 
 
search.on('input', ()=> { 
    searchVal = search.val(); 
    render(); 
}); 
 
 
 
// ! Пагинация 
function drawPaginationButtons(){ 
    fetch(`${API}?q=${searchVal}`).then((res)=> res.json()).then((data)=>{ 
        pageTotalCount=Math.ceil(data.length / 6); // Общее количество элементов 
        paginationList.html(''); 
 
        for(let i=1; i<=pageTotalCount; i++){ 
            if(currentPage===i){ 
                paginationList.append( 
                    `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`) 
            }else{ 
                paginationList.append(
`<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`
                ) 
            } 
        } 
    }) 
} 
 
 
$('body').on('click', '.page_number', function(){ 
    currentPage=this.innerText; 
    render(); 
}); 
 
prev.on('click', ()=>{ 
    if(currentPage<=1){ 
        return 
    } 
    currentPage --; 
    render(); 
}); 
 
next.on('click', ()=>{ 
    if(currentPage >= pageTotalCount){ 
        return 
    } 
    currentPage ++; 
    render(); 
});