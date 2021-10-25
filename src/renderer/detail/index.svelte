<script lang="ts">
</script>

<div class="header">
  <div class="poster">
    <img
      src="https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg"
      alt="poster"
    />
  </div>
  <div class="info">
    <h1>Fight Club</h1>
    <p>
      When an engineer learns of a mysterious, impenetrable fortress hidden
      under The Bank of Spain, he joins a crew of master thieves who plan to
      steal the legendary lost treasure locked inside while the whole country is
      distracted by Spain's World Cup Final. With thousands of soccer fans
      cheering in the streets, and security forces closing in, the crew have
      just minutes to pull off the score of a lifetime.
    </p>
  </div>
</div>

<style>
  .header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .header::before {
    content: "";
    position: absolute;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 255, 0.5),
        rgba(255, 255, 0, 0.5)
      ),
      url("https://image.tmdb.org/t/p/w500/3nv2TEz2u178xPXzdKlZdUh5uOI.jpg");
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 500px;
    opacity: 0.4;
    z-index: -1;
  }

  .poster {
    height: 500px;
    padding: 20px;
    box-sizing: border-box;
  }

  .poster > img {
    max-height: 100%;
    box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .info {
    max-width: 500px;
    max-height: 500px;
    overflow-y: auto;
    flex: 1;
  }

  @media (max-width: 500px) {
    .header::before {
      height: 200px;
    }
    .poster {
      height: 200px;
    }
    .info {
      max-height: 200px;
    }
  }
</style>
