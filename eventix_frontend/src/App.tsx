import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import AppRoutes from './route/AppRoutes';
import ToastNotification from './components/commons/ToastNotification';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          {/* Global Components like Toast can live here */}
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;