
export const transformOptions = (menuoptions: HTMLElement) => {
  const included = Array.from(menuoptions.getElementsByClassName("included"));
  const excluded = Array.from(menuoptions.getElementsByClassName("excluded"));
  const optionsIncluded: number[] = [];
  const optionsExcluded: number[] = [];
  included.map((option) => {
    optionsIncluded.push(Number(option.getAttribute("id")?.split("-")[0]));
  });

  excluded.map((option) => {
    optionsExcluded.push(Number(option.getAttribute("id")?.split("-")[0]));
  });
  return (optionsIncluded.length || optionsExcluded.length) ? {
    optionsIncluded: (optionsIncluded.length) ? optionsIncluded : undefined,
    optionsExcluded: (optionsExcluded.length) ? optionsExcluded : undefined
  } : undefined;
};