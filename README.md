

```
# Matatu Link 🚍

**Description**  
Matatu Link is a web application that allows tracking and managing the transport industry efficiently.  
It provides a list of **saccos, routes, and matatus** for a specific sacco, along with **fares** for routes covered by particular matatus.  
Users can **view, add, update, and delete matatus**.

---

## 🛠 Technologies

**Client Side**  
- React (Vite)  
- Tailwind CSS  
- React Router DOM  

**Server Side**  
- Flask  
- Flask-RESTful  
- Flask-Migrate  
- Flask-CORS  
- SQLAlchemy + Serializer  
- Gunicorn  

**Database**  
- SQLite3 (development)  
- PostgreSQL (production)

---

## 📂 Project Structure

```

matatu_link/
│
├── server/
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   └── client/
│       ├── pages/
│       │   ├── Homepage.jsx
│       │   ├── MatatuPage.jsx
│       │   ├── SaccosPage.jsx
│       │   └── RoutesPage.jsx
│       └── ...
└── README.md

````

- **Relationships**  
  - A sacco has many routes  
  - A sacco has many matatus  
  - Many matatus can cover many routes  
  - Many routes can have many matatus  
  - A route covered by a matatu has a specific fare

---

## ⚙️ Local Setup

### Clone the repository
```bash
git clone git@github.com:FrancisKarani14/matatu_link.git
cd matatu_link
````

### Backend (Flask)

```bash
cd server
pipenv install
pipenv shell
python app.py
```

* Runs the backend at `http://localhost:5000`
* run the API endpoints in app.py on postman

### Frontend (React)

```bash
cd server/client
npm install
npm run dev
```

* Runs the frontend at `http://localhost:5173` (default Vite port)

---

## 🌐 Live Deployment

* Open [https://matatu-link-20.onrender.com/](https://matatu-link-20.onrender.com/) in your browser

**Pages:**

* **Homepage**
  ![Homepage](https://github.com/user-attachments/assets/ee45d949-40d3-4fd7-accc-166327965dcb)

* **Saccos Page**
  ![Saccos](https://github.com/user-attachments/assets/fa2ac41e-fc20-445f-b4f7-7b6c61356757)

* **Matatus Page**
  ![Matatus](https://github.com/user-attachments/assets/6afc0eaf-1598-49e9-be60-21643edd1d8f)

* **Routes Page**
  ![Routes](https://github.com/user-attachments/assets/00e6121a-8e19-4f85-87aa-3dfcbea5b2ca)

---

## ✨ Authors

* Francis Karani
* Najma Q Boru

---

## 📄 License

**MIT License**
Copyright © 2025 Francis Karani, Najma Q Boru

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```

---


```
