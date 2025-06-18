import { configureStore } from "@reduxjs/toolkit"
import { configureHttp } from "@/shared/api/http"
import { logoutUser } from "@/features/auth/model/thunks"
import searchReducer from "@/entities/search/model/slice"
import filtersReducer from "@/features/article-filters/model/slice"
import paginationReducer from "@/features/pagination/model/slice"
import authReducer from "@/features/auth/model/slice"
import passwordRecoveryReducer from "@/features/auth/passwordRecovery/model/slice"


export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
    pagination: paginationReducer,
    auth: authReducer,
    passwordRecovery: passwordRecoveryReducer,
  },
})

configureHttp({
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  onLogout: () => {
    localStorage.removeItem('refreshToken')
    store.dispatch(logoutUser())
    window.location.href = '/'
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

