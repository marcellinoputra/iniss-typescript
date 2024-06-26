import { create } from "zustand"


export const useMenuAdmin = create(() => ({
    menuAdmin: [
        {
            id: 0,
            name: "Home",
            url: "/",
        },
        {
            id: 1,
            name: "Akses Guru",
            url: "/admin/guru-adm",
        },

        {
            id: 2,
            name: "Akses Murid",
            url: "/admin/murid-adm",
        },

        {
            id: 3,
            name: "Akses Mapel",
            url: "/admin/mapel-adm",
        },

        {
            id: 4,
            name: "Akses Kelas",
            url: "/admin/kelas-adm",
        },
    ]
})
)

export const useToggleSidebarAdmin = create((set) => ({
    mobileOpen: false,
    setMobileOpen: () => set((state:  any) => ({ mobileOpen: !state.mobileOpen })),
}))

export const useChangeNavbarAdmin = create((set) => ({
    changeNav: 0,
    changeNavbars: (location: any) => {
        if (location.pathname === "/admin") {
            set({ changeNav: 0 })
        } else if (location.pathname === "/admin/guru-adm") {
            set({ changeNav: 1 })
        } else if (location.pathname === "/admin/murid-adm") {
            set({ changeNav: 2 })
        } else if (location.pathname === "/admin/mapel-adm") {
            set({ changeNav: 3 })
        } else if (location.pathname === "/admin/kelas-adm") {
            set({ changeNav: 4 })
        }
    }
}))