import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {store} from './store' //redux
import {Provider} from 'react-redux' //redux
import {ToastContainer} from "./components/ui/ToastContainer.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <ToastContainer />
        <App />
    </Provider>
  </StrictMode>,
)
