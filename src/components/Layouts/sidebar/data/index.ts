import * as Icons from "../icons";

export const NAV_DATA = [

  
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Home",
        url: "/home",
        icon: Icons.HomeIcon,
        items: [],
      },

      {
        title: "My Matches",
        url: "/matches",
        icon: Icons.User, // or any icon you prefer from your `icons.tsx`
        items: [
          {
            title: "Requests",
            url: "/matches/requests",
          },
          {
            title: "Matched",
            url: "/matches/matched",
          },
        ],
      },

      {
        title: "Preference",
        url: "/preference",
        icon: Icons.FourCircle,
        items: [],
      },
    ]
  }
]
      
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },

