import React from 'react'
import './assets/theme.css'
import { Provider } from 'react-redux'
import { store } from './store'
import AppRoutes from './routes/AppRoutes'

export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			<AppRoutes />
		</Provider>
	)
}
