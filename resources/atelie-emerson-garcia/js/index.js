async function main(){
    burger()
    cssNavbar()
    checkSearchSubmit()

    if(screen.width < 768){

        let inputSearch = document.getElementsByClassName('input-search')[0]

        inputSearch.addEventListener('click', (e) => {
            if(e.target.id == 'input-search'){
                return
            }

            let inputClassList = Array.from(inputSearch.classList)
        
            let indexOfActive = inputClassList.indexOf('active')

            if(indexOfActive >= 0){
                inputSearch.classList.remove('active')
            }else{
                inputSearch.classList.add('active')
            }

        })
    }
}

function burger(){
    let burger = document.getElementById('burger')
    let navbarItems = document.getElementById('navbar-items')

    burger.addEventListener('click', (e) => {
        // if(screen.width < 768){
      if(burger.classList.contains('active')){
          burger.classList.remove('active')
          navbarItems.classList.add('closed')
          navbarItems.classList.remove('opened')
      }else{
          burger.classList.add('active')
          navbarItems.classList.add('opened')
          navbarItems.classList.remove('closed')
      }
        // }
    })
}

function cssNavbar(){
    let scrollEl = document.scrollingElement
    let nav = document.querySelector('.navbar')

    document.addEventListener("scroll", (event) => {
        // console.log(scrollEl.scrollTop)
        if(scrollEl.scrollTop >= 120){
            nav.classList.add('active')
            nav.classList.add('fixed')
        }else{
            nav.classList.remove('active')
            nav.classList.remove('fixed')
        }
    })
}

function checkSearchSubmit(){
    const inputSearch = document.getElementById('input-search')
    const list = document.getElementById('autocomplete-list');

    list.innerHTML = '';

    fetch('./../assets/data/servicos.json')
        .then(response => response.json())
        .then(data => {
            inputSearch.addEventListener('input', function () {

            if(inputSearch.value == ''){
                list.innerHTML = '';
                return
            }

            const conjunto = Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse);

            const parsedData = Array.from(conjunto);
            
            const searchTerm = inputSearch.value.toLowerCase();
            const filteredData = parsedData.filter(item => item.name.toLowerCase().includes(searchTerm));

            // Limpa a lista de sugestões
            list.innerHTML = '';

            // Adiciona as sugestões filtradas à lista
            filteredData.forEach(item => {
              const listItem = document.createElement('li');
              listItem.textContent = item.name;

              listItem.addEventListener('click', function () {
                // Preenche o input com o valor clicado
                inputSearch.value = item.name;
                // Limpa a lista de sugestões
                list.innerHTML = '';

                window.location.href = `${item.slug}.html`
              });

              list.appendChild(listItem);
            });
          });
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

// async function mountServices(filters = null){

//     let serviceData = await readJsonFile("./../assets/data/servicos.json")

//     if(Array.isArray(serviceData)){
//       let keys = Object.keys(filters)
//       keys.map(key => {
//         if(filters[key] && filters[key] != ''){
//           serviceData = serviceData.filter(x => {
//             return x[key] && x[key].indexOf(filters[key]) >= 0
//           })
//         }
//       })
//       let servicesPageRow = document.querySelector('#services-page-row')
//       let servicesGallery = document.querySelector('#image-gallery')
//       servicesPageRow.innerHTML = ''

//       if(serviceData.length > 0){
//         if(servicesPageRow){

//           let htmlText = ''

//           let limit = serviceData.length < 18 ? serviceData.length : 18

//           //Populando serviços dentro da uma row encontrada com id services-row
//           for(i = 0; i < limit ; i++){

//               let service = serviceData[i]

//               htmlText+='<div class="col-md-3 my-3">'
//               htmlText+='<div class="catalog_item">'
//               htmlText+=`<figure style="background-image: url('${service.image}');">`
//               htmlText+=`<a href="${service.slug}.html">${service.name}</a>`
//               htmlText+=`</figure>`
//               htmlText+='</div>'
//               htmlText+='</div>'

//           }

//           servicesPageRow.innerHTML = htmlText

//         }
//         if(servicesGallery){

//             let currentService = window.location.pathname.replace('/','').replace('.html','');
//             currentService = serviceData.find(x => x.slug = currentService)

//             await Promise.all(
//                 currentService.gallery.map(async (d, i) => {
//                     //Criando o Item
//                     let galleryItem = document.createElement('div')
//                     galleryItem.classList.add('gallery_item')

//                     //Criando input Radio
//                     let inp = document.createElement('input')
//                     inp.type = 'radio'
//                     inp.id = `img-${i}`
//                     inp.name = 'gallery'
//                     inp.classList.add('gallery_selector')
//                     inp.checked = true
//                     galleryItem.append(inp)

//                     //Criando gallery_img
//                     let gimg = document.createElement('img')
//                     gimg.classList.add('gallery_img')
//                     gimg.src = d
//                     galleryItem.append(gimg)

//                     //Criando label da Thumb
//                     let lb = document.createElement('label')
//                     lb.setAttribute('for', `img-${i}`)
//                     lb.classList.add('gallery_thumb')
//                     let limg = document.createElement('img')
//                     limg.src = d
//                     lb.append(limg)
//                     galleryItem.append(lb)

//                     //Finalizando importação
//                     servicesGallery.append(galleryItem)
//                 })
//             )
//         }
//       }
//     }else{
//       console.error('Services must be an Array.')
//     }
// }

window.addEventListener('load', main);
