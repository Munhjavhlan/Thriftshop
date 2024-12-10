# My Project
This is a collaborative web development project for building a web application.

## Team Members
- Developer 1: Frontend Development Batbayar, Munkhjavhklan, Badamgarav
- Developer 2: Backend Development Batbayar, Munkhjavhklan, Badamgarav
- Developer 3: DevOps and CI/CD Integration Batbayar, Munkhjavhklan, Badamgarav

## Technologies
- HTML, CSS, JavaScript
- Node.js
- MySql

## Instructions for Running the Project
1. Clone the repository

# Git болон GitHub ашиглах заавар

---

## 1. Локал орчинд өөрчлөлт хийж байршуулах

### Локал төслөө шинэчилнэ:
```bash
$ git add .
```
Энэ команд нь таны локал орчин дахь бүх өөрчлөлтүүдийг Git-т нэмнэ.

### Хийсэн өөрчлөлтөө тайлбарлах:
```bash
$ git commit -m "Тайлбар текст"
```
`-m` нь commit хийх өөрчлөлтөд тайлбар өгч байна. Жишээ нь:
```bash
$ git commit -m "Initial commit"
```
### GitHub руу өөрчлөлтийг илгээх:
```bash
$ git push origin master
```
Энэ команд нь таны локал өөрчлөлтүүдийг GitHub дээрх репозитор руу илгээнэ.

### Шинэ хувилбарыг татаж авах:
```bash
$ git pull origin master
```
Энэ команд нь GitHub дээрх шинэ өөрчлөлтүүдийг таны локал орчинд татаж авна.

---

## 2. GitHub дээр хамтран ажиллах

### Fork болон Pull Request хийх:
- **Fork хийх**: Хэрэв та өөр хүний төслийн хувилбарыг авахыг хүсвэл GitHub дээрээс "Fork" товчийг дарж, тухайн төслийг өөрийн репозитор руу хуулах боломжтой.
- **Pull Request**: Хэрэв та өөрчлөлт хийсэн бол тухайн өөрчлөлтөө GitHub дээрх төслийн эзэнд санал болгохын тулд Pull Request үүсгэж болно.

---

## 3. Git командууд

### Шинэ репозитор клонийг татах:
```bash
$ git clone https://github.com/Munhjavhlan/Thriftshop.git
```
Энэ команд нь GitHub дээрх репозиторын хуулбарыг таны локал орчинд татаж авчирна.

### Таны ажлын төлөвийг шалгах:
```bash
$ git status
```
Энэ команд нь таны локал орчинд ямар өөрчлөлтүүд байгааг харуулна.

### Branch үүсгэх:
```bash
$ git checkout -b branch_name
```
Энэ команд нь шинэ branch үүсгэнэ. Жишээ нь, `feature-branch` үүсгэх бол:
```bash
$ git checkout -b feature-branch
```

### Шинэ branch руу шилжих:
```bash
$ git checkout branch_name
```
Хүссэн branch руу шилжих команд.

### Commit-ийн түүхийг харах:
```bash
$ git log
```
Энэ команд нь таны локал орчинд хийсэн commit-ийн түүхийг харуулна.

