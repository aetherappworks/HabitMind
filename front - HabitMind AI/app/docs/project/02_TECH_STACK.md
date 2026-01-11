# 🔧 Tech Stack - HabitMind AI

Tecnologias e dependências utilizadas.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_FEATURES.md](./01_FEATURES.md) - Funcionalidades
- [02_TECH_STACK.md](./02_TECH_STACK.md) - **Você está aqui**
- [03_ROADMAP.md](./03_ROADMAP.md) - Roadmap

---

## 🛠️ Tech Stack Completo

### **Frontend Framework**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **React Native** | 0.73.2 | Framework mobile |
| **Expo** | ~51.0.0 | Tooling e abstrações |
| **TypeScript** | ~5.3.0 | Tipagem estática |
| **React** | 18.2.0 | UI library |

---

### **State Management**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **Zustand** | ^4.4.1 | State management global |

---

### **HTTP Client**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **Axios** | ^1.6.2 | HTTP requests |

---

### **Navigation**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **React Navigation** | ^6.1.9 | Navegação de telas |
| **React Navigation Stack** | ^6.3.20 | Stack navigator |
| **React Navigation Tabs** | ^6.5.11 | Bottom tabs |

---

### **Storage**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **Async Storage** | 1.21.0 | Cache local |
| **Expo Secure Store** | ~12.3.1 | Token seguro |

---

### **Utilities**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **Day.js** | ^1.11.10 | Manipulação de datas |
| **React Native SVG** | 13.14.0 | Ícones/gráficos |

---

### **Development Tools**

| Technology | Version | Propósito |
|-----------|---------|----------|
| **Babel** | ^7.20.0 | Transpilação JS |
| **Jest** | ^29.5.0 | Testing framework |

---

### **Plataformas Suportadas**

```
iOS 12.0+
Android 7.0+ (API 24+)
Web (via Expo Web)
```

---

## 📦 Dependências por Categoria

### **React Native Core**
```json
{
  "react-native": "0.73.2",
  "react-native-screens": "~3.29.0",
  "react-native-gesture-handler": "~2.14.1",
  "react-native-reanimated": "~3.6.0",
  "react-native-safe-area-context": "4.8.2",
  "react-native-web": "~0.19.10"
}
```

### **Navigation**
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11"
}
```

### **Data & State**
```json
{
  "zustand": "^4.4.1",
  "axios": "^1.6.2",
  "@react-native-async-storage/async-storage": "1.21.0"
}
```

### **Security**
```json
{
  "expo-secure-store": "~12.3.1"
}
```

---

## 🎯 Versioning Strategy

- **Major**: Breaking changes
- **Minor**: Novas features
- **Patch**: Bug fixes

Atualizar dependências regularmente com:
```bash
npm outdated
npm update
```

---

## 🔗 Links de Referência

- [Anterior: Funcionalidades ←](./01_FEATURES.md)
- [Próxima: Roadmap →](./03_ROADMAP.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
