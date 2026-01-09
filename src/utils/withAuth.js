'use client';
import React, { useEffect } from 'react';
 
export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
 
    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.replace('/');
        }
      }
    }, []);
 
    return <WrappedComponent {...props} />;
  };
}