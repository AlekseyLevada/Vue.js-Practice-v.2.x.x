const querryAjax = (method, queryAddres, callback) => {
    //Инициализируем объект для запроса
    const xhttp = new XMLHttpRequest();
    xhttp.onload = callback

    //Настройка запроса
    xhttp.open(method, queryAddres);

    //Отправляем запрос на сервер
    xhttp.send();
}

const banner = Vue.component(
    "banner",
    {
        data: function () {
            return {

            }
        },
        template: `     
        `,
        props: []
    }
)

const search = Vue.component(
    "search",
    {
        data: function () {
            return {
                dataFromInput: null,
                searchList: null,
                currentPage: 0,
            }
        },
        template: `   
        <section>
            <h2>Поиск вакансии</h2>
            <form>
                <input type='text' placeholder='Вакансия' v-model='dataFromInput'>
                <input type='submit' value='Найти' @click='getInputValue'>
            </form>
            <ul>
                <li class='panel-tab__work-item' v-for='item in searchList'>
                    {{item.name}}
                </li>    
            </ul>
            <div class='button__container' >
                <button @click='searchPrevPage' v-if='currentPage >= 1'>Назад</button>
                <div class='current_page'>Страница: {{currentPage}}</div>
                <button @click='searchNextPage'>Вперед</button>
            </div>
        </section>   
        `,
        methods: {
            getInputValue(e) {
                e.preventDefault()
                axios
                    .get(`https://api.hh.ru/vacancies?text=${this.dataFromInput}&per_page=30&page=${this.currentPage}`)
                    .then(response => {
                        this.searchList = response.data.items
                    })
            },
            searchPrevPage(){
                this.currentPage -=1
                axios
                    .get(`https://api.hh.ru/vacancies?text=${this.dataFromInput}&per_page=30&page=${this.currentPage}`)
                    .then(response => {
                        this.searchList = response.data.items
                    })
            },
            searchNextPage(){
                this.currentPage +=1
                axios
                    .get(`https://api.hh.ru/vacancies?text=${this.dataFromInput}&per_page=30&page=${this.currentPage}`)
                    .then(response => {
                        this.searchList = response.data.items
                        this.pages = response.data.pages
                    })
                    
            },
        },

        created() {
            axios
            .get(`https://api.hh.ru/vacancies/`)
            .then(response => {
                this.searchList = response.data.items
            })
        }, 

        props: []
    }
)

const jobList = Vue.component(
    "jobList",
    {
        data: function () {
            return {

            }
        },
        template: `   
        <section>
            <h2>Вакансии</h2>
              <ul v-if="isAuth">
                    <li class='panel-tab__work-item'
                        v-on:click='switchTab(4, item.id)'
                        v-for="item in workList"
                            >{{item.name}}
                    </li>
              </ul>
              <div v-else>Авторизуйтесь чтобы увидеть вакансии</div>
        </section>  
        `,
        props: ["workList", 'isAuth', 'switchTab'],
    }
)

const login = Vue.component(
    "login",
    {
        data: function () {
            return {
                'login': null,
                'password': null,
            }
        },
        template: `
        <section> 
            <h2>Авторизация</h2>
            <form>
                <input v-model="login" placeholder="Введите логин" type="text" name="login"/>
                <input v-model="password" placeholder="Введите пароль" type="password" name="login" />
                <input v-on:click="auth(event, login, password)" type="submit" value="Авторизация" />
            </form>
            <div v-show="user.notFoundUser" class='error-message'>Пользователь не найден</div>
            <div v-show="user.errorServer" class='error-message'>Ошибка сервера</div>
        </section>
     `,
        props: ["auth", "user"]
    }
)

const header = Vue.component(
    "header",
    {
        data: function () {
            return {

            }
        },
        template: `
        <div>
            <header v-if="user.isAuth">
                <div class='overlay-avatar'>
                    <img v-bind:src='user.img' v-bind:alt='user.alt' />
                </div>
                <h2>
                    {{user.name}} {{user.lastname}} {{user.family}}
                </h2>
                <button v-on:click="logout">Выйти<button>
            </header>
            <header v-else>
                Не авторизованы
            </header>
        </div>
        `,
        methods: {

        },
        props: ['title', 'user', 'logout']
    }
)

const detailVacancies = Vue.component(
    'detail',
    {
        data: function () {
            return {
                data: null,
                title: 'Детализация вакансии',
                similar: null,
            }
        },
        template: `
            <section>
                <main>
                    <h1>{{title}}</h1>
                    ID: {{idVacancies}}
                    Название вакансии: {{data?.name}}
                </main>
                <footer>
                    <h2>Похожие вакансии</h2>
                    <ul>
                        <li class='panel-tab__work-item'
                            v-for='item in similar'
                            v-on:click='switchTab(4,item.id)'
                            v-bind:key='item.id'>
                            {{item.name}}
                        </li>
                    </ul>
                <footer>
            </section>
        `,
        props: ['idVacancies', 'switchTab'],
        beforeCreate: function () {
            //console.log('beforeCreate', this)
            //console.log('beforeCreate', this.idVacancies)
        },
        created: function () {
            //console.log('created', this)
            //console.log('created', this.idVacancies)
            querryAjax('GET', `https://api.hh.ru/vacancies/${this.idVacancies}`, (event) => {
                const dataFromServer = JSON.parse(event.currentTarget.responseText);
                //console.log('dataFromServer',dataFromServer)
                this.data = dataFromServer
            })
            querryAjax('GET', `https://api.hh.ru/vacancies/${this.idVacancies}/similar_vacancies`, (event) => {
                const dataFromServer = JSON.parse(event.currentTarget.responseText);
                //console.log('dataFromServer',dataFromServer)
                this.similar = dataFromServer.items
            })
        },
    }
)

const main = Vue.component(
    "main",
    {
        data: function () {
            return {

            }
        },
        template: `
        <main>
        <button id='destroy' v-on:click='destroy'>Уничтожить компонент</button>
            <div class='control-panel'>
                <button 
                    v-bind:class="currentTab == 1 ? 'active' : 'none' " 
                    v-on:click="switchTab(1)"
                >
                    Список вакансий
                </button>
                <button 
                    v-bind:class="currentTab == 2 ? 'active' : 'none' " 
                    v-on:click="switchTab(2)"
                >
                    Поиск вакансии по слову
                </button>
                <button 
                    v-bind:class="currentTab == 3 ? 'active' : 'none' "
                    v-on:click="switchTab(3)"
                    v-show="!user.isAuth"
                >                
                    Авторизоваться
                </button>
                <button
                    v-show="user.isAuth"
                >                
                    Редактировать профиль
                </button>
            </div>
            <div class='panel'>
                <div v-if="currentTab == 1" class='panel-tab'>
                    <project-jobList
                    v-bind:switchTab='switchTab'
                    v-bind:workList="workList"
                    v-bind:isAuth='user.isAuth'
                    ></project-jobList>
                </div>
                <div v-else-if="currentTab == 2" class='panel-tab'>
                    <project-search> </project-search>
                </div>
                <div v-else-if="currentTab == 3" class='panel-tab'>
                    <project-login v-bind:user="user" v-bind:auth="auth"></project-login>
                </div>
                <div v-else-if="currentTab == 4" class='panel-tab'>
                    <detail-vacancies
                        v-bind:switchTab='switchTab'
                        v-bind:idVacancies='idVacancies'
                    ></detail-vacancies>
                </div>
            </div>   
        </main>
        `,
        methods: {

        },
        props: ['currentTab', 'switchTab', 'workList', "auth", "user", 'isAuth', 'idVacancies', 'destroy'],
        components: {
            'project-login': login,
            'project-jobList': jobList,
            'project-search': search,
            'detail-vacancies': detailVacancies,
        }
    }
)

new Vue(
    {
        el: "#root",
        data: function () {
            return {
                mainTitle: "Сервис для поиска работы",
                user: {
                    isAuth: false,
                    data: null,
                    notFoundUser: false,
                    errorServer: false,
                },
                users: null,
                currentTab: 1,
                workList: [],
                idVacancies: null,
            }
        },
        template: `
        <div>
            <project-header 
                v-bind:title="mainTitle"
                v-bind:user="user"
                v-bind:logout="logout"
            >
            </project-header>
            <project-main
                v-bind:destroy='destroy'
                v-bind:currentTab="currentTab"
                v-bind:switchTab="switchTab"
                v-bind:workList="workList"
                v-bind:auth="auth"
                v-bind:user="user"
                v-bind:idVacancies='idVacancies'
            >
            </project-main>
        </div>
        `,
        beforeCreate: function () {

            const callback = (event) => {
                if (event.currentTarget.status == 200) {
                    const dataFromServer = JSON.parse(event.currentTarget.responseText);
                    this.users = dataFromServer
                } else {
                    //логика при которой данные с сервера не доступны
                }
            }

            const hhCallback = (event) => {
                if (event.currentTarget.status == 200) {
                    const dataFromServer = JSON.parse(event.currentTarget.responseText);
                    this.workList = dataFromServer.items
                } else {
                    //логика при которой данные с сервера не доступны
                }
            }


            querryAjax('GET', './DB/user.json', callback)
            querryAjax('GET', 'https://api.hh.ru/vacancies', hhCallback)

        },
        methods: {
            switchTab: function (goToTab, idVacancies) {
                if (idVacancies) {
                    this.idVacancies = idVacancies
                }
                this.currentTab = goToTab
            },
            auth: function (event, login, password) {
                event.preventDefault()
                // console.log('login', login)
                // console.log('password', password)

                let user
                try {
                    user = this.users.find(function (user) {
                        if (user.login == login && user.password == password) {
                            return user;
                        }
                    }
                    )
                }
                catch (error) {
                    console.log('Ошибка', error)
                    this.user.errorServer = true
                }
                if (user) {
                    //Логика авторизации найденого пользовател
                    this.user = user;
                    this.user.isAuth = true;
                    this.switchTab(1);

                } else {
                    //Логика вывода уведомления, что пользователь не найден
                    if (!this.user.errorServer)
                        this.user.notFoundUser = true
                }
            },
            logout: function () {
                console.log("logout работает")
                //Вернули данные внутри пользователя к начальному состоянию
                this.user = {
                    isAuth: false,
                    data: null,
                    notFoundUser: false
                }
                //Перевели экран к форме авторизации
                this.switchTab(3);
            },
            destroy: function () {
                //console.log('Уничтожить компонент')
                this.$destroy()
            }
        },
        mounted: function () {
            //console.log(this.$el.outerHTML)
        },
        updated: function () {
            //console.log(this.$el)
        },
        components: {
            'project-header': header,
            'project-main': main,
        }
    }
)
/**
 * Справочная информация по API HH
    https://api.hh.ru/vacancies/55539939 - Инфа по вакансии
    https://api.hh.ru/vacancies - Все вакансии
    https://api.hh.ru/vacancies/55539939/similar_vacancies - поиск похожих вакансий
    https://api.hh.ru/vacancies?text=java&area=1&metro=6.8 - поиск ваканcий по слову java
 */