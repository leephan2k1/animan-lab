import * as nsfwjs from "nsfwjs";

export default function () {
  const verify = async (img) => {
    const model = await nsfwjs.load();

    const predictions = await model.classify(img);

    let valid = true;

    predictions.forEach((item) => {
      if (
        item.probability > 0.85 &&
        (item.className === "Hentai" ||
          item.className === "Porn" ||
          item.className === "Sexy")
      ) {
        valid = false;
        return;
      }
    });

    return valid;
  };

  return { verify };
}
