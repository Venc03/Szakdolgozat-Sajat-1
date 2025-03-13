# Laravel11 api és autentikáció, React login

**A Laravel autentikációhoz a Breeze csomagot fogjuk használni, amely a Sanctumot alkalmazza az API token-alapú autentikációhoz, és a CSRF tokent a kérések biztonságos kezelésére.**


Egy RESTful alkalmazás esetén a backend számára fontos ellenőrizni, hogy a végpontjaira érkezett kérések kiszolgálhatók-e, vagyis van-e jogosultsága a kérő félnek az adott végpont eléréséhez.
Például nem biztos, hogy bárki számára elérhetővé szeretnénk tenni az alkalmazottaink listáját. Ezért a kívülről érkező kéréseket azonosítanunk kell.

## CSRF token alapú azonosítás

A CSRF token (Cross-Site Request Forgery token) egy védekezési mechanizmus, amely megakadályozza a jogosulatlan műveletek végrehajtását egy webalkalmazásban. Ez különösen fontos, ha a frontend és a backend külön hoston fut, mivel a böngésző automatikusan továbbítja a hitelesítési sütiket az azonos domainhez, ami támadási felületet teremthet.

A CSRF token egyedi, véletlenszerűen generált karakterlánc, amelyet a backend azonosít minden hiteles kérésnél. Ez a token a következőképpen védi az alkalmazást:

1. **Token generálása**: A backend minden felhasználói munkamenethez generál egy CSRF tokent, amelyet a frontendnek továbbít (általában egy sütiben vagy az API válaszában).
2. **Token használata**: A frontend minden állapotváltoztató (pl. POST, PUT, DELETE) kérésben elküldi a CSRF tokent a backend számára, tipikusan a kérés fejlécében vagy a kéréssel együtt.
3. **Token ellenőrzése**: A backend ellenőrzi, hogy a kapott token egyezik-e a felhasználói munkamenethez tartozóan tárolt tokennel. Ha nem egyezik, a kérés elutasításra kerül.

A CSRF token egy további biztonsági réteg, amely garantálja, hogy a kérés a frontend alkalmazásból érkezik, nem pedig egy külső támadótól.
A backend minden POST, PUT, DELETE vagy más műveletnél ellenőrizze a CSRF tokent.
 A frontend oldalon ügyelni kell arra, hogy a CSRF tokent ne lehessen könnyen megszerezni. 



# Laravel telepítése és beállításai
<a href="https://www.youtube.com/watch?v=LmMJB3STuU4&list=PL38wFHH4qYZUXLba1gx1l5r_qqMoVZmKM">Videó alapján</a>

<a href="https://laravel.com/docs/11.x/installation">Telepítési útmutató</a>

    laravel new example-app

A telepítés során válaszd a breeze-t és az api végpontokat. 


### .ENV fájl

Az env fájlban az alábbi változtatások kellenek.

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel_react_api
    DB_USERNAME=root
    DB_PASSWORD=

    APP_URL=http://localhost
    FRONTEND_URL=http://localhost:3000
    SANCTUM_STATEFUL_DOMAINS=localhost:3000

A SESSION_DRIVER értékét állítsuk át cookie-ra, hogy a fontend oldali kiszolgálónk tudja kezelni a csrf tokent
Valamint a SESSION_DOMAIN értékét localhostra kell állítani

    SESSION_DRIVER=cookie #database helyett
    SESSION_DOMAIN=localhost

 Szintén a telepítés során a kérdésekre adott válaszokkal konfigurálható és az adatbázis rögtön migrálható is.
 Ne felejtsd el az api key-t generálni, ha nem tette volna meg a telepítő automatikusan!

    php artisan key:generate

## Néhány szó a  SESSION_DRIVER konfigurációs beállításról

A Laravel alkalmazásban a SESSION_DRIVER konfigurációs beállítás azt határozza meg, hogy a munkamenet (session) adatokat milyen tárolási módszerrel kezelje az alkalmazás. 

1. **SESSION_DRIVER=database**

- **Tárolási hely**: Az adatbázisban tárolja a munkamenet adatokat.
- **Használat**: Ez a módszer ideális, ha több szervert használsz (pl. load balancing esetén), és azt szeretnéd, hogy minden szerver ugyanazokat a munkamenet adatokat érje el. Az adatbázis biztosítja, hogy a munkamenetek megosztottak legyenek.
Követelmény: Egy munkamenetek számára létrehozott tábla szükséges az adatbázisban. A php artisan session:table parancs létrehozza ezt a táblát, majd a php artisan migrate alkalmazza.
- **Előnyök**:
    Jobb skálázhatóság több szerver esetén.
    Biztonságosabb lehet, mivel az adatbázis hozzáférése jobban kontrollálható.
- **Hátrányok**: Lassabb lehet, mint a cookie alapú módszer, mivel minden munkamenet-ellenőrzéshez adatbázis-lekérdezés szükséges.

2. **SESSION_DRIVER=cookie**

- **Tárolási hely**:  A kliens (felhasználó) böngészőjében, cookie formájában tárolja a munkamenet adatokat.
- **Használat**: Ez a módszer egyszerűbb és kevésbé erőforrásigényes, mivel nem használja az adatbázist.
- **Előnyök**
    Gyorsabb, mivel nem kell adatbázis-lekérdezéseket végezni.
    Nem kell külön adatbázis-tábla a munkamenetekhez.
    Skálázható, mert a munkamenet adatokat a kliens gépe hordozza.
- **Hátrányok**:
    A munkamenet adatok mérete korlátozott (a cookie méretkorlátja miatt).
    Nem alkalmas érzékeny adatok tárolására, hacsak nem titkosítod megfelelően.
    Ha a felhasználó törli a cookie-kat, elvesznek az adatok.

## Felhasználó létrehozása és migrálása az adatbázisba: 

    php artisan migrate:fresh --seed



# React telepítése

Az alábbi <a href="https://www.youtube.com/watch?v=LPaSteXj0MQ&list=PL6tf8fRbavl2Y9nntlYBVS64bk28ffekB&index=2">videó</a> vite-tel telepíti, de a lényeg ugyanaz. 

    npx create-react-app react_frontend

## Alapcsomagok telepítése

1. <a href="https://react-bootstrap.netlify.app/docs/getting-started/introduction">react bootstrap</a>
        npm install react-bootstrap bootstrap

    Ne felejstd el az index.js-be importálni:

        import 'bootstrap/dist/css/bootstrap.min.css';

2. <a href="https://www.npmjs.com/package/axios">axios</a>
        npm install axios

3. <a href="https://reactrouter.com/home">react router </a>
        npm install react-router


**Ne feledd, hogy a frontend és a backend alkalmazást külön VS Code ablakban indítsd el!**





