<?php

use PHPUnit\Framework\TestCase;

class AlloTest extends TestCase
{
    public function testAddition()
    {
        $calculator = new Calculator();
        $result = $calculator->add(2, 3);
        $this->assertEquals(5, $result);
    }
}

class Calculator
{
    public function add($a, $b)
    {
        return $a + $b;
    }
}
