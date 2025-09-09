# 📚 MultiSellerBookstore – React Native App

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B52AE?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)

---

## 🎯 Project Overview

This is the official mobile client for the **MultiSellerBookstore** platform, built with **React Native** and **Expo**. It provides a seamless, cross-platform user experience for both buying and selling second-hand books, all powered by a robust backend API.

The app features a dynamic interface that adapts based on the user's role, providing a tailored experience for buyers browsing for books and for sellers managing their inventory and sales.

---

## ✨ Key Features

-   **Dynamic Role-Based UI**: The entire app interface and navigation dynamically switches between **Buyer Mode** and **Seller Mode**.
-   **Full E-commerce Workflow**: A complete user journey from browsing and adding to the cart, to placing orders and tracking their status.
-   **Seller Dashboard & Tools**: Sellers get a dedicated dashboard to manage their book listings (add, edit, delete), track incoming orders, and view sales.
-   **Secure Authentication**: Secure user login and registration with persistent sessions managed via `AsyncStorage`.
-   **Global State Management**: Centralized API service with Axios interceptors to automatically handle JWT tokens and global error states (like token expiration).
-   **Modular & Reusable Components**: Built with a clean architecture featuring reusable components for everything from book cards to custom input fields.
-   **Intuitive Navigation**: A smooth and logical navigation flow powered by React Navigation, including separate tab navigators for each user role.

---

## 🛠️ Technology Stack

| Category         | Technology / Library                                                                                                                                                                                                                              |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Core**         | [React Native](https://reactnative.dev/), [Expo](https://expo.dev/)                                                                                                                                                                                |
| **Navigation**   | [React Navigation](https://reactnavigation.org/) (Native Stack, Bottom Tabs)                                                                                                                                                                       |
| **API & State**  | [Axios](https://axios-http.com/), [AsyncStorage](https://react-native-async-storage.github.io/async-storage/), [React Hook Form](https://react-hook-form.com/)                                                                                         |
| **UI Components**| [React Native Paper](https://reactnativepaper.com/), [React Native Elements](https://reactnativeelements.com/), [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) |
| **Image Handling**| [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)                                                                                                                                                                         |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version)
-   `npm` or `yarn`
-   [Expo Go](https://expo.dev/go) app on your physical device (iOS or Android)
-   The **MultiSellerBookstore Backend Server** must be running on your local network.

### Installation & Setup

1.  **Clone the repository**
    ```
    git clone https://github.com/johnkhore5911/multi-seller-bookstore-app.git
    cd multi-seller-bookstore-app
    ```

2.  **Install NPM packages**
    ```
    npm install
    ```

3.  **Configure the Backend API URL**
    Open the file `src/services/api.js` and change the `API_BASE_URL` to the local IP address of the machine where your backend server is running.
    ```
    // src/services/api.js
    const API_BASE_URL = 'http://YOUR_LOCAL_IP_ADDRESS:3000/api';
    ```

4.  **Start the development server**
    ```
    npm start
    ```

5.  **Run the app**
    Scan the QR code shown in the terminal using the Expo Go app on your mobile device.

---

<details>
<summary><strong>📁 App Architecture & File Structure</strong></summary>

The project follows a clean and scalable architecture, separating concerns into distinct directories.


```
/MultiSellerBookstore
  ├── /src
      ├── /components          # Reusable UI components
      │   ├── BookCard.js     # Book display card
      │   ├── CartItem.js     # Cart item component
      │   ├── OrderCard.js    # Order display card
      │   └── LoadingSpinner.js
      ├── /screens            # All screen components
      │   ├── /auth
      │   │   ├── WelcomeScreen.js
      │   │   ├── LoginScreen.js
      │   │   └── RegisterScreen.js
      │   ├── /buyer
      │   │   ├── StorefrontScreen.js
      │   │   ├── ProductDetailScreen.js
      │   │   ├── CartScreen.js
      │   │   └── BuyerOrdersScreen.js
      │   ├── /seller
      │   │   ├── BookListingScreen.js
      │   │   ├── AddBookScreen.js
      │   │   ├── EditBookScreen.js
      │   │   ├── SalesDashboardScreen.js
      │   │   └── SellerOrdersScreen.js
      │   └── /shared
      │       └── ProfileScreen.js
      ├── /navigation         # Navigation setup
      │   ├── AppNavigator.js
      │   ├── AuthNavigator.js
      │   ├── BuyerTabNavigator.js
      │   └── SellerTabNavigator.js
      ├── /services          # API calls
      │   ├── api.js         # Axios configuration
      │   ├── authService.js # Authentication APIs
      │   ├── bookService.js # Book-related APIs
      │   ├── cartService.js # Cart APIs
      │   └── orderService.js # Order APIs
      ├── /utils             # Helper functions
      │   ├── storage.js     # AsyncStorage helpers
      │   ├── constants.js   # App constants
      │   └── validation.js  # Form validation
      └── /styles           # Global styles
          ├── colors.js     # Color theme
          └── globalStyles.js
```


</details>

<details>
<summary><strong>🧭 Navigation Flow</strong></summary>

The app's navigation is structured logically based on the user's authentication status and role.

1.  **App Launch**: The `AppNavigator` checks `AsyncStorage` for a user token.
    -   **No Token**: The user is directed to the `AuthNavigator`.
        -   `WelcomeScreen` -> `LoginScreen` / `RegisterScreen`
    -   **Token Exists**: The user is logged in. The app checks the user's role.

2.  **Logged-In User**:
    -   **Role is `buyer`**: The `BuyerTabNavigator` is rendered.
        -   **Tabs**: Home, Cart, Orders, Profile.
    -   **Role is `seller`**: The `SellerTabNavigator` is rendered.
        -   **Tabs**: My Books, Dashboard, Orders, Profile.

3.  **Role Switching**:
    -   The `RoleSwitcher` component in the `ProfileScreen` allows the user to toggle their role.
    -   This updates the role in `AsyncStorage` and triggers a re-render of the `AppNavigator`, loading the appropriate tab navigator.

</details>

---


## 📜 License

This project is developed for assignment purposes. All rights are reserved by the developer.

---

## 📧 Contact

John Khore - [johnkhore26@gmail.com](mailto:johnkhore26@gmail.com) - +91 9056653906

Project Link: [https://github.com/johnkhore5911/multi-seller-bookstore-app](https://github.com/johnkhore5911/multi-seller-bookstore-app.git)

