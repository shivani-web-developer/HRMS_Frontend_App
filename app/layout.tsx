import "./globals.css";
import {ToastContainer} from 'react-toastify';
import ReduxProvider from './ReduxProvider';

export const metadata = {
  title: 'HRMS',
  description: 'HRMS Dashboard',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
         <ToastContainer position="top-right" autoClose={3000} />
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
