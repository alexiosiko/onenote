import NavBar from "@/components/nav/navbar";

export default function Layout({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }> ) {
	return (
		<div>
			<NavBar />
			{children}
		</div>
	);
}
  