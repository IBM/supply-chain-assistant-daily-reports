// Naive confusion matrix and accuracy calculation for use in the sample tests

// Return a confusion matrix for the given true/expected and predicted values
const confusion = (yTrue, yPred, labels) => {
  return yTrue.reduce((C, yt, i) => {
    C[labels.indexOf(yt)][labels.indexOf(yPred[i])]++;
    return C;
  }, labels.map(() => new Int32Array(labels.length)));
};

// Return a classification report for a given confusion matrix
const report = (C, labels) => {
  const tp = new Int32Array(C.length);
  const fp = new Int32Array(C.length);
  const fn = new Int32Array(C.length);
  let t = 0;
  let n = 0;

  C.map((row, r) => row.map((v, c) => {
    if(c === r) {
      tp[c] += v;
      t += v;
    }
    else {
      fp[c] += v;
      fn[r] += v;
    }
    n += v;
  }));

  return {
    accuracy: t / n,
    details: C.map((l, i) => {
      const precision = tp[i] / (tp[i] + fp[i] || 1);
      const recall = tp[i] / (tp[i] + fn[i] || 1);
      return {
        label: labels[i],
        precision, recall,
        f1score : 2 * (precision * recall) / (precision + recall || 1),
        support: tp[i] + fn[i]
      };
    })
  };
};

exports.confusion = confusion;
exports.report = report;

