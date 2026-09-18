# Agent Notes

- Before finishing UI changes, verify phone-sized widths around 360-430px. Text, buttons, cards, and grids must wrap cleanly without overlap or horizontal overflow; use responsive type, `min-w-0`, stable widths, and explicit wrapping where long labels need it.
- Same-site navigation tabs and links must show immediate loading feedback so users know the click was received. Reuse `RouteLoadingProvider` / `useRouteLoading` or an equivalent shared loading pattern instead of shipping silent navigation.
