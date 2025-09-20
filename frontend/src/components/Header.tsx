import React from "react";
interface HeaderProps {
  title: string;
}
export const Header = ({ title }: HeaderProps) => (
  <header className="header">{title}</header>
);
