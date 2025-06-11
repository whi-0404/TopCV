# Job Search Website

Website tìm kiếm việc làm được xây dựng bằng React và Tailwind CSS.

## Cấu trúc thư mục

```
job-search-website/
├── public/
│   ├── index.html
│   └── assets/
│       └── images/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── job/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobSearch.tsx
│   │   │   └── JobFilter.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Jobs.tsx
│   │   ├── JobDetail.tsx
│   │   ├── Companies.tsx
│   │   ├── Profile.tsx
│   │   └── Auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   ├── job.ts
│   │   └── user.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Cài đặt

1. Clone repository
```bash
git clone <repository-url>
cd job-search-website
```

2. Cài đặt dependencies
```bash
npm install
```

3. Cài đặt Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Chạy dự án
```bash
npm start
```

## Công nghệ sử dụng

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query 