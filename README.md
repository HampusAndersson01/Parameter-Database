# Express-API

Jag har skapat ett REST-API för en simpel meny till en resturang. Varje objekt består av ett id, namn och pris.

## Bygga och starta projektet

Börja med att köra `npm install` i terminalen för att installera alla dependencies. sedan kan du starta projektet med `npm run dev`.

## Endpoints

### GET

För att visa all mat i menyn kör man en GET http://localhost:4444/menu som visar menyn i json format

### PUT

För att uppdatera ett objekt i menyn kör man en PUT http://localhost:4444/menu/id där id är id:t på maten du vill ändra med json i body

`{ "title": "Steak", "price": 129, }`

### POST

För att skapa en ny maträtt kör man en POST http://localhost:4444/menu med json i body

`{ "title": "Steak", "price": 129, }`

### DELETE

För att ta bort en maträtt kör man en DELETE http://localhost:4444/menu/id där id är maträtten man vill ta bort

## Krav för godkänt

- [x] Projektet innehåller minst 4 st. endpoints (GET, POST, PUT & DELETE för en resurs)
- [x] Samtliga endpoints skall kunna nås via en REST Client fil (.rest|.http)
- [x] Datan som API:et hanterar sparas lokalt i serverfilen
- [x] APIét ska svara med 404 om datan saknas.
- [x] Git & GitHub har använts
- [x] Projektmappen innehåller en README.md fil - (läs ovan för mer info)
- [x] Uppgiften lämnas in i tid!

## Krav för väl godkänt

- [ ] Alla punkter för godkänt är uppfyllda
- [ ] All data skall vara sparad i en JSON-fil istället för i serverfilen
- [ ] Datan i JSON-filen skall uppdateras då något läggs till, uppdateras eller tas bort
- [ ] Ett klient-gränssnitt skall byggas för att anropa API:ets alla olika endpoints och presentera datan, redigeringsformulär skall fyllas i med befintlig information.
- [ ] Ytterligare en GET endpoint skall läggas till där det går att hämta ett specifikt objektigare en GET endpoint skall läggas till där det går att hämta ett specifikt objekt
