import image1 from "./example_imgs/influenza-plaque-assay-cell-staining-low-contrast.png";
import image2 from "./example_imgs/control-cell-tem-circles.jpg";
export const NUM_PER_PAGE = 6;

export const examples = [
  {
    question: `I am analyzing my influenza virus plaque assay. MDCK cells were infected with low pathogenic avian influenza A virus for 1 h at 37°C & 5% CO2 in a medium with 4% bovine serum albumin for virus adsorption. The infected cell monolayer was incubated with a 0.45% agarose overlay in growth medium supplemented with 1 µg/mL of L-(tosylamido-2-phenyl) ethyl chloromethyl ketone (TPCK)-treated trypsin for 48 hours at 37°C & 5% CO2. However, my well looks like this and quantification is difficult. What has likely occurred? `,
    answer: `
    A. The cells have not grown fully confluent by the time of the infection
    B. The cells have not been incubated long enough with the overlay medium after infection
    C. The agarose concentration was too high and should have been decreased below 0.45%
    D. MDCK cells should not have been chosen for an influenza plaque assay
    E. The trypsin concentration was too high for avian influenza A viruses
    F. The staining solution concentration should have been lower
    G. The agarose overlay was too hot during pouring, leading to diffuse plaques`,
    image: image1.src,
    correctAnswerChoice: "D",
    answerType: "multipleChoice",
  },
  {
    question: `    I am doing TEM of HEK293FT cells with and without Coxsackievirus B3 infection. I imaged my wildtype, uninfected samples but was surprised to see little electron-dense circles (highlighted) in the majority of cells. What are these? `,
    answer: `
    A. The circles are CVB3 virions and there must have been a sample swap or the uninfected cells were accidentally infected
    B. The cells imaged have mycoplasma contamination
    C. The circles are exosomes
    D. The circles are debris that is an artifact of the negative staining
    E. The circles are the Golgi network`,
    image: image2.src,
    correctAnswerChoice: "D",
    answerType: "multipleChoice",
  },
];
