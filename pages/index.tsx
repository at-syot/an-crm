import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Entry from "../src/components/Entry";

export const getStaticProps: GetStaticProps<{
  lineliffID?: string;
}> = async () => {
  return {
    props: { lineliffID: process.env.LINELIFF_ID },
  };
};

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;
export default function Home(props: HomeProps) {
  return <Entry {...props} />;
}
