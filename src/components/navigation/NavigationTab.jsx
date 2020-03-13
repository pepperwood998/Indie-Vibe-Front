import React from 'react';
import { NavLink } from 'react-router-dom';

function NavigationTab(props) {
  const { items } = props;

  return (
    <div className='tab-menu-wrapper'>
      <ul className='tab-menu'>
        {items.map((item, index) => (
          <li key={index}>
            {Array.isArray(item.href) ? (
              <NavLink
                to={item.href[1]}
                className='link-bright-gray font-short-big font-weight-bold font-gray-light'
                isActive={(match, location) => {
                  return item.href.includes(location.pathname);
                }}
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                to={item.href}
                className='link-bright-gray font-short-big font-weight-bold font-gray-light'
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavigationTab;
