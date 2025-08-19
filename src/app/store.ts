import { configureStore } from "@reduxjs/toolkit"
import { configureHttp } from "@/shared/api/http"
import { logoutUser } from "@/features/auth/model/thunks"
import authReducer from "@/features/auth/model/slice"
import passwordRecoveryReducer from "@/features/auth/passwordRecovery/model/slice"
import { authorProfileApi } from "@/features/author-profile/api/authorProfileApi"
import { profileEditApi } from "@/features/profile-edit/api/profileEditApi"
import { adminUsersApi } from "@/features/admin-users/api/adminUsersApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordRecovery: passwordRecoveryReducer,
    [authorProfileApi.reducerPath]: authorProfileApi.reducer,
    [profileEditApi.reducerPath]: profileEditApi.reducer,
    [adminUsersApi.reducerPath]: adminUsersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authorProfileApi.middleware, profileEditApi.middleware, adminUsersApi.middleware),
})

configureHttp({
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  onLogout: () => {
    localStorage.removeItem("refreshToken")
    store.dispatch(logoutUser())
    window.location.href = "/"
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
