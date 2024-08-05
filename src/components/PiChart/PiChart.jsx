import React, { useEffect, useRef, useState } from "react";

const PiChart = ({ storesInfo }) => {
  let percentages = [20, 30, 25, 35];

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Calculate dimensions and center
    const canvasSize = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvasSize * 0.43;

    // Background circle
    const bgCircleRadius = radius * 0.7; // 70% of the main chart radius
    const bgColor = "#f0f0f0"; // Same as body background color

    // Convert percentages to radians
    const angles = [];
    let startAngle = -Math.PI / 2; // Start from top center

    for (let i = 0; i < storesInfo.length; i++) {
      const angle = (storesInfo[i].percentage / 100) * 2 * Math.PI;
      angles.push(angle);
    }

    // Draw chart segments
    for (let i = 0; i < angles.length; i++) {
      const endAngle = startAngle + angles[i];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Set segment color
      ctx.fillStyle = storesInfo[i].color;
      ctx.fill();

      // Update startAngle for the next segment
      startAngle = endAngle;
    }

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, bgCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Function to generate random colors
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }, [percentages]);

  return <canvas ref={canvasRef} width={200} height={200}></canvas>;
};

export default PiChart;
